# NgxMatForm

This Angular library allows you to dynamically create forms based on a schema. It leverages Angular Reactive Forms and Angular Material components to generate forms with configurable fields, appearance, and validation. The library supports rendering forms dynamically by passing a schema that defines the fields, their types, validation rules, and appearance.

## Key Features

- **Dynamic Form Generation**: Generate forms based on a schema, making it easy to create forms without manually defining each field.
- **Field Types**: Support for multiple input types, such as text, email, number, and more.
- **Validation**: Supports various Angular Validators (like `required`, `minLength`, `maxLength`, `pattern`, etc.), and validation rules can be customized per field.
- **Appearance Customization**: The appearance of form fields can be easily customized using Angular Material styles (e.g., `Outline`, `Filled`).
- **Responsive Layout**: The library allows for flexible layout management using grid columns, making it responsive to different screen sizes.
- **Customizable Labels and Buttons**: Customize button labels (e.g., submit, clear) and field labels based on the schema configuration.
- **Storage of form values**: Store and restore form values with only one parameter

## Compatibility Table

| NgxMatForm Version | Angular Version | Angular Material Version |
|--------------------|-----------------|--------------------------|
| `1.2.0`            | `19.x`          | `19.x`                   |
| `1.1.0`            | `19.x`          | `19.x`                   |
| `1.0.0`            | `19.x`          | `19.x`                   |

### Installation

First, install the `ngx-mat-form` library from npm.

```bash
npm install ngx-mat-form
```

In your `app.module.ts`, import the `NgxMatFormModule` from the library and ensure that the necessary Angular Material modules are also imported (if not already done).

```typescript
import { NgxMatFormModule } from 'ngx-mat-form';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...
      NgxMatFormModule  // Import the form module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
## Component usage example
```html
<ngx-mat-form
        [ngxMatFormSchema]="dynamicFormSchema"
        (onSubmit)="handleSumbit($event)"
        (onReset)="handleReset($event)">
</ngx-mat-form>

```

## How It Works

The schema is a JSON-like object that contains information about the form fields (such as field name, label, validators, input type, etc.), the layout (columns), and button labels. This schema is passed to a component which renders the form with appropriate validations and input types.

Here is an example of how the schema looks:

```typescript
export const DynamicFormSchema: NgxMatDynamicForm = {
  id: 'ngx.mat.form.example1',
  name: 'ngx-mat-schema-example',
  restoreForm: true,
  storeKey: 'ngx.mat.form.schema.myfeature',
  labelButtons: {
    submit: "Submit",
    clear: "Clear",
  },
  columns: 4,
  fields: [
    // Field definitions go here...
  ]
};
```
## `NgxMatForm` Properties

The `NgxMatForm` schema defines the structure and configuration for a dynamic form. Below are the main properties you can use:

- **`id`** (string)
  - Unique identifier for the form.
  - Example: `'DynamicFormSchemaId'`.

- **`name`** (string)
  - Name of the form, typically used for reference or accessibility purposes.
  - Example: `'DynamicFormSchemaName'`.

- **`restore`** (boolean)
  - Set true if the form should be restored on initialization.
  - Example: `true`.

- **`storeKey`** (string)
  - The key of the form storage in the session store
  - Example: `ngx.mat.form.schema.myfeature`.

- **`labelButtons`** (object)
  - Defines the labels for form buttons such as submit and clear.
  - Properties:
    - **`submit`** (string): Label for the submit button.
    - **`clear`** (string): Label for the clear button.
  - Example:
    ```typescript
    labelButtons: {
      submit: 'Submit',
      clear: 'Clear',
    }
    ```

- **`columns`** (number)
  - Defines the number of columns to be used for the form layout.
  - Example: `4`.

- **`fields`** (array of `NgxMatField`)
  - Array that defines the form fields. Each field is an object of type `NgxMatField`.

### `NgxMatField` Properties

Each object in the `fields` array has the following properties:

- **`id`** (string)
  - Unique identifier for the field.
  - Example: `'name-field'`.

- **`name`** (string)
  - Name of the field, used for the form control.
  - Example: `'name'`.

- **`label`** (string)
  - The label displayed for the field.
  - Example: `'Name'`.

- **`appearance`** (enum: `NgxMatFieldAppearance`)
  - Defines the appearance style of the field.
  - Example: `NgxMatFieldAppearance.Outline`.

- **`type`** (enum: `NgxFieldTypes`)
  - Specifies the type of the input field (e.g., text, email, number).
  - Example: `NgxFieldTypes.Text`.

- **`placeholder`** (string)
  - Placeholder text for the input field.
  - Example: `'Enter your name'`.

- **`availableValues`** (any[])
  - Array of elements for a select type, and radio buttons
  - Example: `[{id: 1, label: 'Example label option'}]`.

- **`isSelectMultiple`** (boolean)
  - Define if a select is multiple
  - Example: `true`.

- **`displayProperty`** (string)
  - Define the displayed label for the availableValues list
  - Example: `'label'`.

- **`valueProperty`** (string)
  - Define the value of the options of the availableValues list
  - Example: `'id'`.

- **`validators`** (array of objects)
  - Array of validation rules for the field.
  - Each object contains:
    - **`validator`** (string): The type of validator (e.g., `'required'`, `'minLength'`).
    - **`value`** (any): The value associated with the validator (e.g., `true`, `10`, regex pattern).
  - Example:
    ```typescript
    validators: [
      {
        validator: 'required',
        value: true
      },
      {
        validator: 'minLength',
        value: 2
      }
    ]
    ```

### Example

```typescript
export const DynamicFormSchema: NgxMatDynamicForm = {
  id: 'DynamicFormSchemaId',
  name: 'DynamicFormSchemaName',
  restoreForm: true,
  storeKey: 'ngx.mat.form.schema.myfeature',
  labelButtons: {
    submit: 'Submit',
    clear: 'Clear',
    buttonPosition: NgxMatFormButtonPositions.Left
  },
  columns: 4,
  fields: [
    {
      id: 'name-field',
      name: 'name',
      label: 'Name',
      appearance: NgxMatFieldAppearance.Outline,
      type: NgxFieldTypes.Text,
      placeholder: 'Enter your name',
      validators: [
        {
          validator: 'required',
          value: true
        }
      ]
    },
    {
      id: 'email-field',
      name: 'email',
      label: 'Email',
      appearance: NgxMatFieldAppearance.Outline,
      type: NgxFieldTypes.Email,
      placeholder: 'Enter your email',
      validators: [
        {
          validator: 'pattern',
          value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
        },
        {
          validator: 'required',
          value: true
        }
      ]
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
    }
  ]
};
```
## NgxMatFormService
Service that provides useful tools to interact or modify the NgxMatFormSchema

### `NgxMatFormService` Features

- **`setAvailableValues`**
  - Giving field name, and a customised array of entities, populate the availableValues of one field
  - ```typescript
    // Name of the field
    // Elements to apply
    // NgxMatFormSchema
    this.ngxMatFormService.setAvailableValues('gender', this.exampleOptions, this.schema);
    ```
- **`setProperty`**
  - Override a property of one field.
  - ```typescript
    // Name of the field
    // Property to override
    // Value to applied to the propery
    // NgxMatFormSchema
    this.ngxMatFormService.setProperty('gender', 'valueProperty', 'versionId', this.schema);
    this.ngxMatFormService.setProperty('gender', 'displayProperty', 'code', this.schema);
    ```

## Benefits

- **Dynamic and Configurable**: Easily add or remove fields, change field types, or adjust validation rules based on the schema.
- **Reusable**: The same schema can be reused across different parts of the application, reducing duplication and improving consistency.
- **Consistent Design**: With Angular Material integration, the form automatically adheres to Material Design principles, ensuring a consistent user experience across your application.
- **Flexible Layout**: Allows for responsive layout management using grid columns, adapting to different screen sizes.
- **Easy to Use**: Create forms with minimal configuration, just by defining the fields and validation in the schema.
- **Angular Reactive Forms Integration**: Fully integrates with Angular's Reactive Forms, offering powerful form control features like validation, error handling, and state management.

---
This section describes the functionality and purpose of the library in English. You can add this to your `README.md` to give users an overview of how the library works and how it can be beneficial.
