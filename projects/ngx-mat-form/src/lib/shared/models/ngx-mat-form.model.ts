import {NgxMatField} from "./ngx-mat-field.model";

export class NgxMatForm {
  public id: string;
  public name: string;
  public storeKey?: string;
  public labelButtons: {
    submit: string,
    clear: string,
  };
  public columns: number;
  public fields: NgxMatField[];

  constructor(
    id: string,
    name: string,
    storeKey: string,
    labelButtons: {
      submit: string,
      clear: string
    },
    columns: number,
    fields: any[]) {
    this.id = id;
    this.name = name;
    this.storeKey = storeKey;
    this.labelButtons = labelButtons;
    this.columns = columns;
    this.fields = fields;
  }
}
