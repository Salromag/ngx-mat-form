# NgxMatDynamicForm

This Angular library allows you to dynamically create forms based on a schema. It leverages Angular Reactive Forms and Angular Material components to generate forms with configurable fields, appearance, and validation. The library supports rendering forms dynamically by passing a schema that defines the fields, their types, validation rules, and appearance.


## Key Features

- **Dynamic Form Generation**: Generate forms based on a schema, making it easy to create forms without manually defining each field.
- **Field Types**: Support for multiple input types, such as text, email, number, and more.
- **Validation**: Supports various Angular Validators (like `required`, `minLength`, `maxLength`, `pattern`, etc.), and validation rules can be customized per field.
- **Appearance Customization**: The appearance of form fields can be easily customized using Angular Material styles (e.g., `Outline`, `Filled`).
- **Responsive Layout**: The library allows for flexible layout management using grid columns, making it responsive to different screen sizes.
- **Customizable Labels and Buttons**: Customize button labels (e.g., submit, clear) and field labels based on the schema configuration.

## Example: How to Add the Dynamic Form Module to Your App

To integrate the `NgxMatDynamicForm` library into your existing Angular application with Angular Material already set up, follow these steps:

### Step 1: Install the Library

First, install the `ngx-mat-dynamic-form` library from npm.

```bash
npm install ngx-mat-dynamic-form
```

### Step 2: Import the Module

In your `app.module.ts`, import the `NgxMatDynamicFormModule` from the library and ensure that the necessary Angular Material modules are also imported (if not already done).

```typescript
import { NgxMatDynamicFormModule } from 'ngx-mat-dynamic-form';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatFormFieldModule,  // Ensure Angular Material modules are imported
    MatInputModule,
    MatButtonModule,
    NgxMatDynamicFormModule  // Import the dynamic form module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
## Use Case

This library is ideal for situations where forms need to be generated dynamically based on a configuration or schema. It provides a simple and reusable way to create complex forms, improving developer productivity and ensuring consistent form structures across your application.

## How It Works

The schema is a JSON-like object that contains information about the form fields (such as field name, label, validators, input type, etc.), the layout (columns), and button labels. This schema is passed to a component which renders the form with appropriate validations and input types.

Here is an example of how the schema looks:

```typescript
export const DynamicFormSchema: NgxMatDynamicForm = {
  id: 'DynamicFormSchemaId',
  name: 'DynamicFormSchemaName',
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
## `NgxMatDynamicForm` Properties

The `NgxMatDynamicForm` schema defines the structure and configuration for a dynamic form. Below are the main properties you can use:

### Properties

- **`id`** (string)
  - Unique identifier for the form.
  - Example: `'DynamicFormSchemaId'`.

- **`name`** (string)
  - Name of the form, typically used for reference or accessibility purposes.
  - Example: `'DynamicFormSchemaName'`.

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
  labelButtons: {
    submit: 'Submit',
    clear: 'Clear',
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
    }
  ]
};
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

