import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExampleMatDynamicForm, NgxMatDynamicForm, NgxMatDynamicFormService, NgxMatField} from "../shared";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'ngx-mat-dynamic-form',
  standalone: false,
  templateUrl: './ngx-mat-dynamic-form.component.html',
  styleUrls: ['./ngx-mat-dynamic-form.component.scss']
})
export class NgxMatDynamicFormComponent implements OnInit {
  @Input() formSchema: NgxMatDynamicForm;
  @Output() onSumbit: EventEmitter<FormGroup> = new EventEmitter();
  @Output() onReset: EventEmitter<void> = new EventEmitter();

  ngxDynamicForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ngxMatDynamicFormService: NgxMatDynamicFormService) {
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
    this.ngxDynamicForm = this.formBuilder.group(formControls);
  }

  submit(): void {
    this.onSumbit.emit(this.ngxDynamicForm);
  }

  clear(): void {
    this.ngxDynamicForm.reset();
    this.onReset.emit(this.ngxDynamicForm.value);
  }

  // Formatting form
  getGridTemplate(): string {
    return `repeat(${this.formSchema.columns}, minmax(200px, 1fr))`;
  }
}
