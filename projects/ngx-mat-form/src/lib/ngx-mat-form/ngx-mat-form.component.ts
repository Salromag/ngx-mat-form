import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgxFieldTypes, NgxMatField, NgxMatFormSchema, NgxMatFormService} from "../shared";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CONFIG} from "../shared/injection-token/config-token";

@Component({
  selector: 'ngx-mat-form',
  standalone: false,
  templateUrl: './ngx-mat-form.component.html',
  styleUrls: ['./ngx-mat-form.component.scss']
})
export class NgxMatFormComponent implements OnInit {
  @Input() ngxMatFormSchema: NgxMatFormSchema;
  @Output() onSubmit: EventEmitter<FormGroup> = new EventEmitter();
  @Output() onReset: EventEmitter<void> = new EventEmitter();
  @Output() onFormChanges: EventEmitter<FormGroup> = new EventEmitter();

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ngxMatFormService: NgxMatFormService,
    @Inject(CONFIG) private config: NgxMatFormService,) {
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
    const formControls: any = {};
    this.ngxMatFormSchema.fields.forEach((field: NgxMatField) => {
      formControls[field.name] = [null, this.ngxMatFormService.addFieldValidators(field)];
      if (field.type === NgxFieldTypes.DateRange) {
        formControls[field.name + '-start'] = [null, this.ngxMatFormService.addFieldValidators(field)]
        formControls[field.name + '-end'] = [null, this.ngxMatFormService.addFieldValidators(field)]
      }
    });
    this.form = this.formBuilder.group(formControls);
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
    this.form.valueChanges.subscribe((value: any) => {
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
