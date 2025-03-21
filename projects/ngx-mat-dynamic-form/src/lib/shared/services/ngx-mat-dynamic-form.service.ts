import {Injectable} from '@angular/core';
import {NgxMatDynamicForm} from "../models/ngx-mat-dynamic-form.model";
import {Validators} from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class NgxMatDynamicFormService {

  constructor() {
  }


  /**
   * Handle validators
   * @param validator
   * @param value
   */
  getValidator(validator: string, value: any): any {
    switch (validator) {
      case 'max':
        return Validators.max(value);
      case 'min':
        return Validators.min(value);
      case 'required':
        return Validators.required;
      case 'pattern':
        return Validators.pattern(value);
      case 'minLength':
        return Validators.minLength(value);
      case 'maxLength':
        return Validators.maxLength(value);
      default:
        return null;
    }
  }
}
