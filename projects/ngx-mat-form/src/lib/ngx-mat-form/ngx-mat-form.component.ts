import {Component, EventEmitter, Inject, Input, DoCheck, OnDestroy, OnInit, Output} from '@angular/core';
import {NgxFieldTypes, NgxMatField, NgxMatFormSchema, NgxMatFormService} from "../shared";
import {FormBuilder, FormGroup, ValidatorFn} from "@angular/forms";
import {NgxMatFormConfig} from "../shared/models/ngx-mat-form-config.model";
import {Subscription} from "rxjs";
import {CONFIG} from "../shared/injection-token/config-token";

export type NgxMatFormValue = Record<string, any>;

@Component({
  selector: 'ngx-mat-form',
  standalone: false,
  templateUrl: './ngx-mat-form.component.html',
  styleUrls: ['./ngx-mat-form.component.scss']
})
export class NgxMatFormComponent implements OnInit, DoCheck, OnDestroy {
  @Input() ngxMatFormSchema: NgxMatFormSchema;
  @Output() onSubmit: EventEmitter<NgxMatFormValue> = new EventEmitter();
  @Output() onReset: EventEmitter<NgxMatFormValue> = new EventEmitter();
  @Output() onFormChanges: EventEmitter<NgxMatFormValue> = new EventEmitter();

  form: FormGroup;
  private formChangesSubscription?: Subscription;
  private fieldSnapshot: unknown[] = [];
  private schemaValidators = new Map<string, ValidatorFn[]>();

  constructor(
    private formBuilder: FormBuilder,
    private ngxMatFormService: NgxMatFormService,
    @Inject(CONFIG) private config: NgxMatFormConfig,) {
  }

  ngOnInit() {
    this.createForm();
    this.onFormChange();
    if (this.ngxMatFormSchema.restoreForm) {
      this.restoreFormValues();
    }
  }

  /**
   * Create the dynamic form controls
   */
  createForm(): void {
    this.form = this.formBuilder.group({});
    this.schemaValidators.clear();
    this.syncFields();
  }

  ngDoCheck(): void {
    if (!this.form) return;
    const snapshot = this.ngxMatFormSchema.fields.flatMap(field => [
      field.name, field.type, field.validators?.length,
      ...(field.validators ?? []).flatMap(rule => [rule.validator, rule.value])
    ]);
    if (snapshot.length !== this.fieldSnapshot.length ||
      snapshot.some((value, index) => !Object.is(value, this.fieldSnapshot[index]))) {
      this.syncFields();
    }
  }

  ngOnDestroy(): void {
    this.formChangesSubscription?.unsubscribe();
  }

  private syncFields(): void {
    const controls = new Map<string, ValidatorFn[]>();
    this.ngxMatFormSchema.fields.forEach((field: NgxMatField) => {
      const validators = this.ngxMatFormService.addFieldValidators(field);
      // Keep the legacy range key in emitted values, without an invisible required control.
      controls.set(field.name, field.type === NgxFieldTypes.DateRange ? [] : validators);
      if (field.type === NgxFieldTypes.DateRange) {
        controls.set(field.name + '-start', validators);
        controls.set(field.name + '-end', validators);
      }
    });
    Object.keys(this.form.controls).forEach(name => {
      if (!controls.has(name)) {
        this.form.removeControl(name, {emitEvent: false});
        this.schemaValidators.delete(name);
      }
    });
    controls.forEach((validators, name) => {
      let control = this.form.controls[name];
      if (!control) {
        control = this.formBuilder.control(null);
        this.form.addControl(name, control, {emitEvent: false});
      }
      // Preserve validators installed by Material directives or the consumer.
      control.removeValidators(this.schemaValidators.get(name) ?? []);
      control.addValidators(validators);
      control.updateValueAndValidity({onlySelf: true, emitEvent: false});
      this.schemaValidators.set(name, validators);
    });
    this.fieldSnapshot = this.ngxMatFormSchema.fields.flatMap(field => [
      field.name, field.type, field.validators?.length,
      ...(field.validators ?? []).flatMap(rule => [rule.validator, rule.value])
    ]);
    this.form.updateValueAndValidity();
  }

  submit(): void {
    if (this.ngxMatFormSchema.restoreForm) {
      this.store();
    }
    this.onSubmit.emit(this.form.value);
  }

  clear(): void {
    this.form.reset();
    this.onReset.emit(this.form.value);
  }

  onFormChange(): void {
    this.formChangesSubscription?.unsubscribe();
    this.formChangesSubscription = this.form.valueChanges.subscribe((value: NgxMatFormValue) => {
      this.onFormChanges.emit(value);
    })
  }

  store(): void {
    this.ngxMatFormService.store(this.ngxMatFormSchema, this.form.value);
  }

  restoreFormValues(): void {
    this.form.patchValue(this.ngxMatFormService.restore(this.ngxMatFormSchema));
  }

  getGridTemplate(): string {
    return `repeat(${this.ngxMatFormSchema.columns}, minmax(200px, 1fr))`;
  }
}
