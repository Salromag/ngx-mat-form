import {Injectable} from '@angular/core';
import {ValidatorFn, Validators} from "@angular/forms";
import {NgxMatField} from "../models/ngx-mat-field.model";


@Injectable({
  providedIn: 'root'
})
export class NgxMatFormService {

  constructor() {
  }


  /**
   * Add validators for fields
   * @returns ValidatorFn[]
   */
  addFieldValidators(field: NgxMatField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    field.validators?.forEach(config => {
      if (config.validator && config.value) {
        const validatorFunc = this.getValidator(config.validator, config.value);
        if (validatorFunc) {
          validators.push(validatorFunc);
        }
      }
    });
    return validators;
  }

  /**
   * Handle validators
   * @param validator
   * @param value
   * @return ValidatorFn
   */
  getValidator(validator: string, value: any): ValidatorFn | null {
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
