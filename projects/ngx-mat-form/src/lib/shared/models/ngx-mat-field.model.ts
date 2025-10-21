import {NgxFieldTypes} from "../enums/ngx-mat-field-types.enum";
import {NgxMatFieldAppearance} from "../enums/ngx-mat-field-appeareance.enum";
import {Observable} from "rxjs";

export class NgxMatField {
  public id: string;
  public name: string;
  public label: string
  public type: NgxFieldTypes;
  public validators?: { validator: string, value: any }[];
  public appearance: NgxMatFieldAppearance;
  public placeholder?: string;
  public hint?: {
    left?: string;
    right?: string;
  }
  public availableValues?: any[];
  public displayProperty?: string;
  public valueProperty?: string;
  public isSelectMultiple?: boolean;
  public minDate?: Date;
  public maxDate?: Date;
  public filteredOptions?: Observable<string[]>;
  public retrieveOptionsUrl?: string;
  public retrieveOptions?: {
    parameter?: string,
    async?: boolean,
    characters?: 3
    responseProperty?: string,
  }
  public fields?: NgxMatField[];

  constructor(
    id: string,
    name: string,
    label: string,
    type: NgxFieldTypes,
    validators: [{ validator: string, value: any }],
    appearance: NgxMatFieldAppearance,
    placeholder: string,
    hint: {
      left: string,
      right: string
    },
    availableValues: any[],
    displayProperty?: string,
    valueProperty?: string,
    isSelectMultiple?: boolean,
    minDate?: Date,
    maxDate?: Date,
    filteredOptions?: Observable<string[]>,
    retrieveOptionsUrl?: string,
    retrieveOptions?: {
      parameter?: string,
      async?: boolean,
      characters?: 3
      responseProperty?: string,
    },
    fields?: NgxMatField[]) {
    this.id = id;
    this.name = name;
    this.label = label;
    this.type = type;
    this.validators = validators;
    this.appearance = appearance;
    this.placeholder = placeholder;
    this.hint = hint;
    this.availableValues = availableValues;
    this.displayProperty = displayProperty;
    this.valueProperty = valueProperty;
    this.isSelectMultiple = isSelectMultiple;
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.filteredOptions = filteredOptions;
    this.retrieveOptionsUrl = retrieveOptionsUrl;
    this.retrieveOptions = retrieveOptions;
    this.fields = fields;
  }
}
