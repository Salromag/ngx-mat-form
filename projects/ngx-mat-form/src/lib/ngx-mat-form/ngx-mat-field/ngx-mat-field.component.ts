import {Component, Input, OnInit} from "@angular/core";
import {NgxFieldTypes, NgxMatField} from "../../shared";
import {FormControl, FormGroup} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";

@Component({
  selector: "ngx-mat-field",
  templateUrl: "./ngx-mat-field.component.html",
  styleUrls: ["./ngx-mat-field.component.scss"],
  standalone: false
})
export class NgxMatFieldComponent implements OnInit {
  @Input() field: NgxMatField;
  @Input() formGroup: FormGroup;

  valueProperty: any;
  displayProperty: any;

  constructor() {
  }

  ngOnInit(): void {
    let control = this.formGroup.get(this.field.name);
    if (!control) {
      control = new FormControl(null);
      this.formGroup.addControl(this.field.name, control);
    }
    if (this.field.type === NgxFieldTypes.Autocomplete && this.field.availableValues) {
      this.field.filteredOptions = control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '', this.field.availableValues || [])),
      );
    }
    this.fillProperties();
  }

  getValidatorValue(field: NgxMatField, validatorName: string): any {
    const validatorConfig = field.validators?.find((v: any) => v.validator === validatorName);
    return validatorConfig ? validatorConfig.value : null;
  }

  private fillProperties(): void {
    if (this.field.type === NgxFieldTypes.Select || this.field.type === NgxFieldTypes.Radio
      || this.field.type === NgxFieldTypes.Autocomplete) {
      this.valueProperty = this.field.valueProperty || 'id';
      this.displayProperty = this.field.displayProperty || 'label';
    }
  }

  private _filter(value: any, options: any[]): any[] {
    let filterValue: string = '';
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (typeof value === 'object' && value !== null) {
      filterValue = value[this.displayProperty]?.toLowerCase() || '';
    }
    return options.filter(option => option[this.displayProperty]?.toLowerCase().includes(filterValue));
  }

  displayFn(option: any): string {
    return option && this.field?.displayProperty ? option[this.field.displayProperty] : '';
  }
}
