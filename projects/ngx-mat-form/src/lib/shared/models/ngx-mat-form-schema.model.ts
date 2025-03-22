import {NgxMatField} from "./ngx-mat-field.model";

export class NgxMatFormSchema {
  public id: string;
  public name: string;
  public restoreForm: boolean = false;
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
    restoreForm: boolean,
    storeKey: string,
    labelButtons: {
      submit: string,
      clear: string
    },
    columns: number,
    fields: any[]) {
    this.id = id;
    this.name = name;
    this.restoreForm = restoreForm;
    this.storeKey = storeKey;
    this.labelButtons = labelButtons;
    this.columns = columns;
    this.fields = fields;
  }
}
