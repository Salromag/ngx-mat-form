import {Component, Input, OnInit} from "@angular/core";
import {NgxFieldTypes, NgxMatField, NgxMatFormService} from "../../shared";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {
  catchError,
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap
} from "rxjs";

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
    if (this.field.retrieveOptions?.responseProperty) {
      return options[this.field.retrieveOptions?.responseProperty].filter((option: any) => option[this.displayProperty]?.toLowerCase().includes(filterValue));
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
    if (!this.field.retrieveOptionsUrl) return;
    if (this.field.retrieveOptions?.async) {
      this.handleAsyncDataRetrieval(control);
    } else {
      this.handleSyncDataRetrieval(control);
    }
  }

  private handleAsyncDataRetrieval(control: AbstractControl): void {
    control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => this.shouldFetchData(value)),
      switchMap(value =>
        this.fetchData(value).pipe(
          catchError(() => {
            return of([]);
          })
        )
      )
    ).subscribe(response => {
      this.field.filteredOptions = of(this._filter(control.value, response || []));
    });
  }


  private handleSyncDataRetrieval(control: AbstractControl): void {
    this.ngxMatFormService.retrieveData(this.field.retrieveOptionsUrl || '').subscribe({
      next: (response: any) => {
        this.field.filteredOptions = control.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '', response || [])),
        );
      },
      error: error => console.error(error)
    });
  }

  private shouldFetchData(value: any): boolean {
    const minCharacters: number = this.field.retrieveOptions?.characters || 0;
    return typeof value === 'string' && value.length >= minCharacters;
  }

  private fetchData(value: any): Observable<any> {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return of([]);
    }
    const paramKey = this.field.retrieveOptions?.parameter;
    if (!paramKey || typeof paramKey !== 'string') {
      return of([]);
    }
    const params = {[paramKey]: value};
    return this.ngxMatFormService.retrieveData(this.field.retrieveOptionsUrl || '', params);
  }
}
