import {Component, Input, OnInit} from "@angular/core";
import {NgxFieldTypes, NgxMatField, NgxMatFormService} from "../../shared";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {map, startWith} from "rxjs";

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

  constructor(private ngxMatFormService: NgxMatFormService) {
  }

  ngOnInit(): void {
    const control = this.formGroup.get(this.field.name) ?? new FormControl(null);
    if (!this.formGroup.contains(this.field.name)) {
      this.formGroup.addControl(this.field.name, control);
    }

    if (this.field.type === NgxFieldTypes.Autocomplete) {
      if (this.field.availableValues?.length) {
        this.setFilteredOptions(control);
      } else if (this.field.retrieveOptionsUrl) {
        this.getDataFromRemote(control);
      }
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

  private _filter(value: any, options: any): any[] {
    let filterValue: string = '';
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (typeof value === 'object' && value !== null) {
      filterValue = value[this.displayProperty]?.toLowerCase() || '';
    }
    if (this.field.responseProperty) {
      return options[this.field.responseProperty].filter((option: any) => option[this.displayProperty]?.toLowerCase().includes(filterValue));
    } else {
      return options.filter((option: any) => option[this.displayProperty]?.toLowerCase().includes(filterValue));
    }
  }

  displayFn(option: any): string {
    return option && this.field?.displayProperty ? option[this.field.displayProperty] : '';
  }

  private setFilteredOptions(control: AbstractControl): void {
    this.field.filteredOptions = control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.field.availableValues ?? []))
    );
  }

  getDataFromRemote(control: AbstractControl): void {
    if (this.field.retrieveOptionsUrl) {
      this.ngxMatFormService.retrieveData(this.field.retrieveOptionsUrl).subscribe({
        next: (response: any) => {
          this.field.filteredOptions = control.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '', response || [])),
          );
        },
        error: error => {
          console.error(error);
        }
      })
    }
  }
}
