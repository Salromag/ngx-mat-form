import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxMatFormSchema, NgxMatFormService, NgxMatField} from "../shared";
import {FormBuilder, FormGroup} from "@angular/forms";

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

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ngxMatFormService: NgxMatFormService) {
  }

  ngOnInit() {
    this.createForm();
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
      formControls[field.name] = ['', this.ngxMatFormService.addFieldValidators(field)];
    });
    this.form = this.formBuilder.group(formControls);
  }

  submit(): void {
    if (this.ngxMatFormSchema.restoreForm) {
      this.store();
    }
    this.onSubmit.emit(this.form);
  }

  clear(): void {
    this.form.reset();
    this.onReset.emit(this.form.value);
  }

  store(): void {
    this.ngxMatFormService.store(this.ngxMatFormSchema, this.form.value);
  }

  restoreFormValues(): void {
    this.form.patchValue(this.ngxMatFormService.restore(this.ngxMatFormSchema));
  }

  // Formatting form
  getGridTemplate(): string {
    return `repeat(${this.ngxMatFormSchema.columns}, minmax(200px, 1fr))`;
  }
}
