import {Injectable} from '@angular/core';
import {ValidatorFn, Validators} from "@angular/forms";
import {NgxMatField} from "../models/ngx-mat-field.model";
import {NgxMatForm} from "../models/ngx-mat-form.model";
import {NgxFieldTypes} from "../enums/ngx-mat-field-types.enum";


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
   * Fill available values for select
   */
  populateAvailableValues(fieldName: string, availableValues: any, schema: NgxMatForm): void {
    schema.fields.forEach(field => {
      if (field.type === NgxFieldTypes.Select && field.name === fieldName) {
        field.availableValues = availableValues;
      }
    });
  }

  /**
   * Set a property dynamically on a field
   * @param fieldName - The field name of the desired change
   * @param property - The property name to set
   * @param value - The value to assign to the property
   * @param schema - The schema object to modify
   * @returns The updated field object
   */
  setProperty<T extends keyof NgxMatField>(fieldName: string, property: T, value: NgxMatField[T], schema: NgxMatForm): void {
    schema.fields.forEach(field => {
      if (field.name === fieldName) {
        field[property] = value;
      }
    })
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
