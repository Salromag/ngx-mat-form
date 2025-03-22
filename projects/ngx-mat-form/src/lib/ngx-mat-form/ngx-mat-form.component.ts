import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxMatForm, NgxMatFormService, NgxMatField} from "../shared";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'ngx-mat-form',
  standalone: false,
  templateUrl: './ngx-mat-form.component.html',
  styleUrls: ['./ngx-mat-form.component.scss']
})
export class NgxMatFormComponent implements OnInit {
  @Input() formSchema: NgxMatForm;
  @Output() onSubmit: EventEmitter<FormGroup> = new EventEmitter();
  @Output() onReset: EventEmitter<void> = new EventEmitter();

  ngxMatForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ngxMatDynamicFormService: NgxMatFormService) {
  }

  ngOnInit() {
    this.createForm();
  }

  /**
   * Create the dynamic form controls
   */
  createForm(): void {
    const formControls: any = {};
    this.formSchema.fields.forEach((field: NgxMatField) => {
      formControls[field.name] = ['', this.ngxMatDynamicFormService.addFieldValidators(field)];
    });
    this.ngxMatForm = this.formBuilder.group(formControls);
  }

  submit(): void {
    this.onSubmit.emit(this.ngxMatForm);
  }

  clear(): void {
    this.ngxMatForm.reset();
    this.onReset.emit(this.ngxMatForm.value);
  }

  // Formatting form
  getGridTemplate(): string {
    return `repeat(${this.formSchema.columns}, minmax(200px, 1fr))`;
  }
}
