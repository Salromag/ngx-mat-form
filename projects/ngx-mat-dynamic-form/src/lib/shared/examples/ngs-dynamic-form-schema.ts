import {NgxMatDynamicForm} from "../models/ngx-mat-dynamic-form.model";
import {NgxMatFieldAppearance} from "../enums/ngx-mat-field-appeareance.enum";
import {NgxFieldTypes} from "../enums/ngx-mat-field-types.enum";

export const DynamicFormSchema: NgxMatDynamicForm = {
  id: 'DynamicFormSchemaId',
  name: 'DynamicFormSchemaName',
  labelButtons: {
    submit: "Submit",
    clear: "Clear",
  },
  columns: 4,
  fields: [
    {
      id: 'name-field',
      name: 'name',
      label: 'Name',
      appearance: NgxMatFieldAppearance.Outline,
      validators: [
        {
          validator: 'minLength',
          value: 1
        },
        {
          validator: 'maxLength',
          value: 10
        }
      ],
      type: NgxFieldTypes.Text,
      placeholder: 'User name',
    },
    {
      id: 'email-field',
      name: 'email',
      label: 'Email',
      appearance: NgxMatFieldAppearance.Outline,
      validators: [
        {
          validator: 'pattern',
          value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
        },
        {
          validator: 'required',
          value: true
        }
      ],
      type: NgxFieldTypes.Email,
      placeholder: 'Email',
    },
    {
      id: 'age-field',
      name: 'age',
      label: 'Age',
      appearance: NgxMatFieldAppearance.Outline,
      validators: [
        {
          validator: 'max',
          value: 10
        },
        {
          validator: 'min',
          value: 2
        }
      ],
      type: NgxFieldTypes.Number,
      placeholder: 'Age',
    }
  ]
}
