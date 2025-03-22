import {NgxMatForm} from "../models/ngx-mat-form.model";
import {NgxMatFieldAppearance} from "../enums/ngx-mat-field-appeareance.enum";
import {NgxFieldTypes} from "../enums/ngx-mat-field-types.enum";

export const ExampleMatForm: NgxMatForm = {
  id: 'ngx.mat.form.example1',
  name: 'ngx-mat-schema-example',
  storeKey: 'ngx.mat.form.schema.myfeature',
  labelButtons: {
    submit: "Submit",
    clear: "Clear",
  },
  columns: 3,
  fields: [
    {
      id: 'name-field',
      name: 'name',
      label: 'Name',
      type: NgxFieldTypes.Text,
      appearance: NgxMatFieldAppearance.Outline,
      placeholder: 'User name',
      validators: [
        {
          validator: 'required',
          value: true
        },
        {
          validator: 'minLength',
          value: 5
        },
        {
          validator: 'maxLength',
          value: 10
        }
      ],
    },
    {
      id: 'password-field',
      name: 'password',
      label: 'Password',
      type: NgxFieldTypes.Password,
      appearance: NgxMatFieldAppearance.Outline,
      placeholder: 'Password',
      validators: [
        {
          validator: 'required',
          value: true
        },
        {
          validator: 'minLength',
          value: 5
        },
        {
          validator: 'maxLength',
          value: 10
        }
      ],
    },
    {
      id: 'address-field',
      name: 'address',
      label: 'Address',
      type: NgxFieldTypes.Text,
      appearance: NgxMatFieldAppearance.Outline,
      placeholder: 'Address',
      validators: [
        {
          validator: 'minLength',
          value: 3
        },
        {
          validator: 'maxLength',
          value: 50
        }
      ],
    },
    {
      id: 'email-field',
      name: 'email',
      label: 'Email',
      type: NgxFieldTypes.Email,
      appearance: NgxMatFieldAppearance.Outline,
      placeholder: 'Email',
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
    },
    {
      id: 'age-field',
      name: 'age',
      label: 'Age',
      type: NgxFieldTypes.Number,
      appearance: NgxMatFieldAppearance.Outline,
      placeholder: 'Age',
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
    },
    {
      id: 'description-field',
      name: 'description',
      label: 'Description',
      type: NgxFieldTypes.Textarea,
      appearance: NgxMatFieldAppearance.Outline,
      placeholder: 'User description',
      validators: [
        {
          validator: 'minLength',
          value: 1
        },
        {
          validator: 'maxLength',
          value: 50
        }
      ],
    }
  ]
}
