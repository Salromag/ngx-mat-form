import {Inject, Injectable} from '@angular/core';
import {ValidatorFn, Validators} from "@angular/forms";
import {NgxMatField} from "../models/ngx-mat-field.model";
import {NgxMatFormSchema} from "../models/ngx-mat-form-schema.model";
import {NgxFieldTypes} from "../enums/ngx-mat-field-types.enum";
import {config, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CONFIG} from "../injection-token/config-token";
import {NgxMatFormConfig} from "../models/ngx-mat-form-config.model";


@Injectable({
  providedIn: 'root'
})
export class NgxMatFormService {

  constructor(
    private http: HttpClient,
    @Inject(CONFIG) private config: NgxMatFormConfig,
  ) {
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
        if (this.config.debug) {
          console.warn(`[${schema.name}]: Setting '${value}' value to ${field.name}.${field[property]} property`);
        }
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
    if (this.config.debug) {
      console.warn(`[${ngxMatForm.name}]: Storing '${JSON.stringify(formValues)}' in the session storage`);
    }
    sessionStorage.setItem(ngxMatForm.storeKey || ngxMatForm.id, JSON.stringify(formValues));
  }

  restore(ngxMatForm: NgxMatFormSchema): any | null {
    const storageKey = ngxMatForm.storeKey || ngxMatForm.id;
    try {
      const storedValue: string | null = sessionStorage.getItem(storageKey);
      if (this.config.debug) {
        console.warn(`[${ngxMatForm.name}]: Restore '${storageKey}' values from the session storage`);
      }
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      return null;
    }
  }

  clearStorageValues(ngxMatForm: NgxMatFormSchema): void {
    sessionStorage.removeItem(ngxMatForm.storeKey || ngxMatForm.id);
  }

  retrieveData(url: string, values?: Record<string, any>): Observable<any> {
    const params = values
      ? Object.entries(values).reduce((httpParams, [key, value]) =>
        httpParams.append(key, String(value ?? '')), new HttpParams())
      : new HttpParams();
    if (this.config.debug) {
      console.warn(`Retrieving data from: ${url}`);
      console.warn(`Params:`, params.toString());
    }
    return this.http.get<any>(url, {params});
  }
}
