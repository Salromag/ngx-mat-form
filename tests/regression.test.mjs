import '@angular/compiler';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {setTimeout as wait} from 'node:timers/promises';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {firstValueFrom, of, Subject, throwError} from 'rxjs';
import {
  NgxMatFormComponent, NgxMatFieldComponent, NgxMatFormService
} from '../dist/ngx-mat-form/fesm2022/ngx-mat-form.mjs';

const service = new NgxMatFormService({}, {debug: false});
const required = [{validator: 'required', value: true}];
const rule = (validator, value) => [{validator, value}];
const values = component => firstValueFrom(component.field.filteredOptions);

function form(fields) {
  const component = new NgxMatFormComponent(new FormBuilder(), service, {});
  component.ngxMatFormSchema = {fields};
  component.ngOnInit();
  return component;
}

function autocomplete(field = {}, remoteService = service) {
  const component = new NgxMatFieldComponent(remoteService);
  component.field = {name: 'friend', type: 'autocomplete', ...field};
  component.formGroup = new FormGroup({friend: new FormControl(null)});
  component.ngOnInit();
  return component;
}

const remoteConfig = {
  retrieveOptionsUrl: '/api/friends',
  retrieveOptions: {async: true, parameter: 'q', characters: 3, responseProperty: 'results'}
};

test('zero-valued numeric and length limits are applied', () => {
  for (const [validator, value] of [['min', -1], ['max', 1], ['maxLength', 'a']]) {
    const control = new FormControl(value, service.addFieldValidators({validators: rule(validator, 0)}));
    assert.equal(control.invalid, true, validator);
  }
  assert.deepEqual(service.addFieldValidators({validators: rule('required', false)}), []);
});

test('required checkboxes must be checked; ordinary required fields accept false', () => {
  const checkbox = new FormControl(false, service.addFieldValidators({type: 'checkbox', validators: required}));
  assert.equal(checkbox.invalid, true);
  checkbox.setValue(true);
  assert.equal(checkbox.valid, true);
  assert.equal(new FormControl(false, service.addFieldValidators({type: 'text', validators: required})).valid, true);
  assert.equal(new FormControl(false, service.addFieldValidators({validators: rule('requiredTrue', true)})).invalid, true);
});

test('required date ranges become valid and preserve the legacy payload keys', () => {
  const component = form([{name: 'period', type: 'daterange', validators: required}]);
  assert.equal(component.form.invalid, true);
  component.form.patchValue({'period-start': new Date(2026, 0, 1)});
  assert.equal(component.form.invalid, true);
  component.form.patchValue({'period-end': new Date(2026, 0, 2)});
  assert.equal(component.form.valid, true);
  assert.equal(component.form.value.period, null);
  assert.deepEqual(Object.keys(component.form.value), ['period', 'period-start', 'period-end']);
  component.ngOnDestroy();
});

test('schema mutations preserve values, remove obsolete fields, and update validation', () => {
  const component = form([{name: 'age', type: 'number', validators: rule('min', 0)}, {name: 'old', type: 'text'}]);
  const age = component.form.get('age');
  age.setValue(2);
  // A directive/consumer validator must survive schema updates.
  const externalValidator = Validators.max(10);
  age.addValidators(externalValidator);
  service.setProperty('age', 'validators', rule('min', 3), component.ngxMatFormSchema);
  component.ngxMatFormSchema.fields.splice(1, 1, {name: 'new', type: 'text', validators: required});
  component.ngDoCheck();
  assert.equal(component.form.get('age'), age);
  assert.equal(age.value, 2);
  assert.equal(age.hasError('min'), true);
  assert.equal(age.hasValidator(externalValidator), true);
  assert.equal(component.form.get('old'), null);
  assert.equal(component.form.get('new').hasError('required'), true);
  component.ngxMatFormSchema = {fields: [{name: 'age', type: 'number'}]};
  component.ngDoCheck();
  assert.equal(age.hasError('min'), false);
  assert.equal(component.form.get('new'), null);
  component.ngOnDestroy();
});

test('changing a range to a normal field removes its endpoints', () => {
  const component = form([{name: 'period', type: 'daterange', validators: required}]);
  component.ngxMatFormSchema.fields[0].type = 'text';
  component.ngDoCheck();
  assert.deepEqual(Object.keys(component.form.controls), ['period']);
  assert.equal(component.form.get('period').hasError('required'), true);
  component.ngOnDestroy();
});

test('events emit plain values and subscriptions stop on destruction', () => {
  const component = form([{name: 'name', type: 'text'}]);
  const changes = [];
  component.onFormChanges.subscribe(value => changes.push(value));
  component.onFormChange(); // Calling this again must not duplicate notifications.
  component.form.patchValue({name: 'Alice'});
  assert.deepEqual(changes, [{name: 'Alice'}]);
  let submitted;
  let reset;
  component.onSubmit.subscribe(value => submitted = value);
  component.onReset.subscribe(value => reset = value);
  component.submit();
  component.clear();
  assert.deepEqual(submitted, {name: 'Alice'});
  assert.deepEqual(reset, {name: null});
  component.ngOnDestroy();
  const count = changes.length;
  component.form.patchValue({name: 'Bob'});
  assert.equal(changes.length, count);
});

test('autocomplete uses default labels and filters local options', async () => {
  const alice = {id: 1, label: 'Alice'};
  const component = autocomplete({availableValues: [alice, {id: 2, label: 'Bob'}]});
  component.formGroup.get('friend').setValue('ali');
  assert.deepEqual(await values(component), [alice]);
  assert.equal(component.displayFn(alice), 'Alice');
  component.field.displayProperty = 'name';
  component.field.availableValues = [{id: 3, name: 'Alison'}];
  component.ngDoCheck();
  assert.deepEqual(await values(component), [{id: 3, name: 'Alison'}]);
  assert.equal(component.displayFn({name: 'Alison'}), 'Alison');
  component.ngOnDestroy();
});

test('remote autocomplete recovers after HTTP errors and malformed responses', async () => {
  let calls = 0;
  const component = autocomplete(remoteConfig, {retrieveData: () => {
    calls++;
    return calls === 1 ? throwError(() => new Error('HTTP 404'))
      : of(calls === 2 ? {} : {results: [{id: 1, label: 'Alice'}]});
  }});
  try {
    for (const [query, expected] of [['absent', []], ['malformed', []], ['alice', [{id: 1, label: 'Alice'}]]]) {
      component.formGroup.get('friend').setValue(query);
      await wait(350);
      assert.deepEqual(await values(component), expected);
    }
    assert.equal(calls, 3);
  } finally {
    component.ngOnDestroy();
  }
});

test('replacing a field with the same options reconnects its filtered options', async () => {
  const availableValues = [{id: 1, label: 'Alice'}];
  const component = autocomplete({availableValues});
  component.field = {name: 'friend', type: 'autocomplete', availableValues};
  component.ngDoCheck();
  assert.deepEqual(await values(component), availableValues);
  component.ngOnDestroy();
});

test('clearing autocomplete cancels requests and removes stale results immediately', async () => {
  const response = new Subject();
  const component = autocomplete(remoteConfig, {retrieveData: () => response});
  try {
    const control = component.formGroup.get('friend');
    control.setValue('alice');
    await wait(350);
    response.next({results: [{id: 1, label: 'Alice'}]});
    assert.equal((await values(component)).length, 1);
    control.setValue('a');
    assert.equal(response.observed, false);
    assert.deepEqual(await values(component), []);
    response.next({results: [{id: 2, label: 'Late response'}]});
    assert.deepEqual(await values(component), []);
  } finally {
    component.ngOnDestroy();
  }
});

test('destroying autocomplete cancels an active request', async () => {
  const response = new Subject();
  const component = autocomplete(remoteConfig, {retrieveData: () => response});
  component.formGroup.get('friend').setValue('alice');
  await wait(350);
  assert.equal(response.observed, true);
  component.ngOnDestroy();
  assert.equal(response.observed, false);
});

test('synchronous retrieval respects the initial value and tolerates HTTP errors', async () => {
  const component = autocomplete({...remoteConfig, retrieveOptions: {responseProperty: 'results'}}, {
    retrieveData: () => of({results: [{id: 1, label: 'Alice'}, {id: 2, label: 'Bob'}]})
  });
  component.formGroup.get('friend').setValue('bob');
  assert.deepEqual(await values(component), [{id: 2, label: 'Bob'}]);
  component.ngOnDestroy();
  const failed = autocomplete({...remoteConfig, retrieveOptions: {responseProperty: 'results'}}, {
    retrieveData: () => throwError(() => new Error('HTTP 500'))
  });
  assert.deepEqual(await values(failed), []);
  failed.ngOnDestroy();
});
