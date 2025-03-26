export class NgxMatFormConfig {
  public debug: boolean = false;
  public locale: string = 'en-US';

  constructor(debug: boolean = false, locale: string = 'en-US') {
    this.debug = debug;
    this.locale = locale;
  }
}
