# NgxMatForm

**NgxMatForm** is an Angular library that allows you to dynamically create forms based on a schema.  
It leverages Angular Reactive Forms and Angular Material components to generate forms with configurable fields, appearance, and validation.  
You can render forms dynamically by passing a schema that defines the fields, their types, validation rules, and appearance.

---

## 🚀 Key Features

- **Dynamic Form Generation**: Automatically generate forms based on a schema, avoiding manual field definitions.
- **Field Types**: Supports multiple input types (text, email, number, date, autocomplete, etc.).
- **Validation**: Includes Angular Validators (`required`, `minLength`, `maxLength`, `pattern`, etc.) with customizable rules per field.
- **Appearance Customization**: Easily customize form field appearance using Angular Material styles (`Outline`, `Filled`, etc.).
- **Responsive Layout**: Flexible grid-based layout system for responsiveness across devices.
- **Customizable Labels and Buttons**: Configure button and field labels directly from the schema.

---

## 🧩 Compatibility Table

| NgxMatForm Version | Angular Version | Angular Material Version | Node Version |
|--------------------|-----------------|--------------------------|--------------|
| `3.1.0`            | `20.x`          | `20.x`                   | `22.x`       |
| `3.0.0`            | `20.x`          | `20.x`                   | `22.x`       | 
| `2.0.0`            | `20.x`          | `19.x`                   | `22.x`       | 
| `1.7.0` → `1.0.0`  | `19.x`          | `19.x`                   | `20.x`       | 

---

## 📦 Installation

Install the library from npm:

```bash
npm install ngx-mat-form
```

### With NgModule

In your `app.module.ts`:

```typescript
import { NgxMatFormModule } from 'ngx-mat-form';

@NgModule({
  declarations: [AppComponent],
  imports: [
    NgxMatFormModule.forRoot({
      debug: true,
      locale: 'en-GB'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## 🧱 `NgxMatForm` Component

### Inputs

- **`ngxMatFormSchema`** (`NgxMatFormSchema`): Schema that defines the form structure.

### Outputs

- **`onFormChanges`** (`FormGroup`): Emits when the form value changes.
- **`onSubmit`** (`FormGroup`): Emits when the form is submitted.
- **`onReset`** (`void`): Emits when the form is reset.

Example usage:

```html
<ngx-mat-form
  [ngxMatFormSchema]="ngxMatFormSchema"
  (onFormChanges)="handleFormChanges($event)"
  (onSubmit)="handleSubmit($event)"
  (onReset)="handleReset($event)">
</ngx-mat-form>
```

---

## ⚙️ Module Configuration

The module accepts configuration options for debugging and locale settings.

| Property | Type | Description | Example |
|-----------|------|-------------|----------|
| `debug` | `boolean` | Enables internal logging | `true` |
| `locale` | `string` | Sets locale for dates and numbers | `'en-GB'` |

---

## 📘 `NgxMatForm` Schema Properties

Defines the configuration for dynamic forms.

| Property | Type | Description | Example |
|-----------|------|-------------|----------|
| `id` | `string` | Unique form identifier | `'DynamicFormSchemaId'` |
| `name` | `string` | Name of the form | `'DynamicFormSchemaName'` |
| `restore` | `boolean` | Restores form state on initialization | `true` |
| `storeKey` | `string` | Key used for session storage | `'ngx.mat.form.schema.myfeature'` |
| `labelButtons` | `object` | Labels for action buttons | `{ submit: 'Submit', clear: 'Clear' }` |
| `columns` | `number` | Grid column count | `4` |
| `fields` | `NgxMatField[]` | Array of field configurations | — |

---

## 🧩 `NgxMatField` Properties

| Property | Type | Description | Example |
|-----------|------|-------------|----------|
| `id` | `string` | Field identifier | `'name-field'` |
| `name` | `string` | Control name | `'name'` |
| `label` | `string` | Field label | `'Name'` |
| `appearance` | `NgxMatFieldAppearance` | Material appearance | `NgxMatFieldAppearance.Outline` |
| `type` | `NgxFieldTypes` | Input type | `NgxFieldTypes.Text` |
| `placeholder` | `string` | Input placeholder | `'Enter your name'` |
| `availableValues` | `any[]` | Values for select/radio fields | `[{id: 1, label: 'Example'}]` |
| `isSelectMultiple` | `boolean` | Allows multiple selections | `true` |
| `displayProperty` | `string` | Property name to display | `'label'` |
| `valueProperty` | `string` | Property name for value | `'id'` |
| `minDate` / `maxDate` | `Date` | Min/max date for pickers | `new Date(2000,0,1)` |
| `retrieveOptionsUrl` | `string` | API URL for autocomplete | `'https://api.example.com'` |
| `retrieveOptions` | `object` | Async autocomplete configuration | See below |
| `validators` | `Array<object>` | Validation rules | See below |

Example `retrieveOptions`:
```typescript
retrieveOptions: {
  parameter: 'name',
  async: true,
  characters: 3,
  responseProperty: 'results'
}
```

Example `validators`:
```typescript
validators: [
  { validator: 'required', value: true },
  { validator: 'minLength', value: 2 }
]
```

## 🧰 `NgxMatFormService`

Utility service to interact with or modify a form schema.

### Methods

- **`setFormProperty(property, value, schema)`**
  ```typescript
  this.ngxMatFormService.setFormProperty('id', 'ngx-new-id', this.schema);
  ```

- **`setAvailableValues(field, values, schema)`**
  ```typescript
  this.ngxMatFormService.setAvailableValues('gender', this.exampleOptions, this.schema);
  ```

- **`setProperty(field, property, value, schema)`**
  ```typescript
  this.ngxMatFormService.setProperty('gender', 'valueProperty', 'versionId', this.schema);
  this.ngxMatFormService.setProperty('gender', 'displayProperty', 'code', this.schema);
  ```

- **`clearStorageValues(schema)`**
  ```typescript
  this.ngxMatFormService.clearStorageValues(this.schema);
  ```

---

## 🧩 Example Schema

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
      validators: [{ validator: 'required', value: true }]
    },
    {
      id: 'gender-field',
      name: 'gender',
      label: 'Gender',
      type: NgxFieldTypes.Select,
      appearance: NgxMatFieldAppearance.Outline,
      placeholder: 'Select gender',
      displayProperty: 'label',
      valueProperty: 'id',
      isSelectMultiple: true,
      availableValues: [
        { id: 1, label: 'Male' },
        { id: 2, label: 'Female' },
        { id: 3, label: 'Other' }
      ]
    },
    {
      id: 'birthday-field',
      name: 'birthday',
      label: 'Birthday',
      type: NgxFieldTypes.Date,
      appearance: NgxMatFieldAppearance.Outline,
      placeholder: 'User birthday',
      hint: { left: 'Add the user birthday' },
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2030, 11, 31)
    },
    {
      id: 'friends-field',
      name: 'friends',
      label: 'Friends',
      type: NgxFieldTypes.Autocomplete,
      appearance: NgxMatFieldAppearance.Fill,
      placeholder: 'User friends',
      hint: { left: 'Add the user friends' },
      displayProperty: 'name',
      valueProperty: 'id',
      retrieveOptionsUrl: 'https://rickandmortyapi.com/api/character',
      retrieveOptions: {
        parameter: 'name',
        async: true,
        characters: 3,
        responseProperty: 'results'
      }
    }
  ]
};
```

---

## 🌟 Benefits

- **Dynamic and Configurable**: Add or remove fields, adjust types, or modify validation rules via schema.
- **Reusable**: Reuse the same schema across multiple components.
- **Consistent Design**: Built with Angular Material, ensuring a cohesive UI.
- **Flexible Layout**: Responsive and grid-based for adaptive layouts.
- **Simple to Use**: Define forms with minimal configuration.
- **Reactive Forms Integration**: Full compatibility with Angular Reactive Forms for validation.
---

🛠 Maintained by **NgxMatForm Team**
