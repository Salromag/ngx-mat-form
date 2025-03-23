import {Injectable} from '@angular/core';
import {ValidatorFn, Validators} from "@angular/forms";
import {NgxMatField} from "../models/ngx-mat-field.model";
import {NgxMatFormSchema} from "../models/ngx-mat-form-schema.model";
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
   * @param fieldName Name of the field to override v
   * @param availableValues Array of availableValues
   * @param schema the NgxMatForm
   */
  setAvailableValues(fieldName: string, availableValues: any, schema: NgxMatFormSchema): void {
    schema.fields.forEach(field => {
      if (field.type === NgxFieldTypes.Select && field.name === fieldName) {
        field.availableValues = availableValues;
      }
    });
  }

  /**
   * Set a property dynamically on a field
   * @param fieldName - The field to be modified
   * @param property - The property name to set
   * @param value - The value to assign to the property
   * @param schema - The schema object to modify
   * @returns The updated field object
   */
  setProperty<T extends keyof NgxMatField>(fieldName: string, property: T, value: NgxMatField[T], schema: NgxMatFormSchema): void {
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

  store(ngxMatForm: NgxMatFormSchema, formValues: any): void {
    sessionStorage.setItem(ngxMatForm.storeKey || ngxMatForm.id, JSON.stringify(formValues));
  }

  restore(ngxMatForm: NgxMatFormSchema): any | null {
    const storageKey = ngxMatForm.storeKey || ngxMatForm.id;
    try {
      const storedValue: string | null = sessionStorage.getItem(storageKey);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error("Error parsing stored form data:", error);
      return null;
    }
  }

  clearStorageValues(ngxMatForm: NgxMatFormSchema): void {
    sessionStorage.removeItem(ngxMatForm.storeKey || ngxMatForm.id);
  }
}
