import {NgxFieldTypes} from "../enums/ngx-mat-field-types.enum";
import {NgxMatFieldAppearance} from "../enums/ngx-mat-field-appeareance.enum";

export class NgxMatField {
  public id: string;
  public name: string;
  public label: string
  public type: NgxFieldTypes;
  public validators?: { validator: string, value: any }[];
  public appearance: NgxMatFieldAppearance;
  public placeholder?: string;
  public availableValues?: any[];
  public displayProperty?: string;
  public valueProperty?: string;
  public isSelectMultiple?: boolean;

  constructor(
    id: string,
    name: string,
    label: string,
    type: NgxFieldTypes,
    validators: [{ validator: string, value: any }],
    appearance: NgxMatFieldAppearance,
    placeholder: string,
    availableValues: any[],
    displayProperty?: string,
    valueProperty?: string,
    isSelectMultiple?: boolean) {
    this.id = id;
    this.name = name;
    this.label = label;
    this.type = type;
    this.validators = validators;
    this.appearance = appearance;
    this.placeholder = placeholder;
    this.availableValues = availableValues;
    this.displayProperty = displayProperty;
    this.valueProperty = valueProperty;
    this.isSelectMultiple = isSelectMultiple;
  }
}
