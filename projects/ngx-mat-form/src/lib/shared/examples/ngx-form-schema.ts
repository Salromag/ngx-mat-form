import {NgxMatFormSchema} from "../models/ngx-mat-form-schema.model";
import {NgxMatFieldAppearance} from "../enums/ngx-mat-field-appeareance.enum";
import {NgxFieldTypes} from "../enums/ngx-mat-field-types.enum";
import {NgxMatFormButtonPositions} from "../enums/ngx-mat-form-button-positions.enum";

export const ExampleMatForm: NgxMatFormSchema = {
  id: 'ngx.mat.form.example1',
  name: 'ngx-mat-schema-example',
  restoreForm: true,
  storeKey: 'ngx.mat.form.schema.myfeature',
  labelButtons: {
    submit: "Submit",
    clear: "Clear",
    buttonPosition: NgxMatFormButtonPositions.Left
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
    },
    {
      id: 'gender-field',
      name: 'gender',
      label: 'Gender',
      type: NgxFieldTypes.Select,
      appearance: NgxMatFieldAppearance.Outline,
      placeholder: 'Select gender',
      displayProperty : 'label',
      valueProperty: 'id',
      isSelectMultiple: true,
      availableValues: [
        { id: 1, label: 'Male' },
        { id: 2, label: 'Female' },
        { id: 3, label: 'Other' },
      ],
    },
    {
      id: 'active-field',
      name: 'active',
      label: 'Active',
      type: NgxFieldTypes.Checkbox,
      appearance: NgxMatFieldAppearance.Outline,
      validators: [
        {
          validator: 'required',
          value: true
        }
      ]
    },
    {
      id: 'plan-field',
      name: 'plan',
      label: 'Plan',
      type: NgxFieldTypes.Radio,
      appearance: NgxMatFieldAppearance.Outline,
      validators: [
        {
          validator: 'required',
          value: true
        }
      ],
      availableValues: [
        {
          id: 1,
          label: 'Business'
        },
        {
          id: 2,
          label: 'Premium'
        }
      ],
      displayProperty: 'label',
      valueProperty: 'id'
    }
  ]
}
