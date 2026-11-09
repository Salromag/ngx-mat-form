import {Component, Input, DoCheck, OnDestroy, OnInit} from "@angular/core";
import {NgxFieldTypes, NgxMatField, NgxMatFormService} from "../../shared";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {
  catchError,
  distinctUntilChanged,
  defer,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  Subject,
  takeUntil,
  timer
} from "rxjs";

@Component({
  selector: "ngx-mat-field",
  templateUrl: "./ngx-mat-field.component.html",
  styleUrls: ["./ngx-mat-field.component.scss"],
  standalone: false
})
export class NgxMatFieldComponent implements OnInit, DoCheck, OnDestroy {
  @Input() field: NgxMatField;
  @Input() formGroup: FormGroup;

  valueProperty: any;
  displayProperty: any;
  private optionsReset = new Subject<void>();
  private optionsSnapshot: unknown[] = [];
  private initialized = false;

  constructor(private ngxMatFormService: NgxMatFormService) {
  }

  ngOnInit(): void {
    this.initialized = true;
    this.configureOptions();
  }

  ngDoCheck(): void {
    if (!this.initialized) return;
    const snapshot = this.getOptionsSnapshot();
    if (snapshot.some((value, index) => !Object.is(value, this.optionsSnapshot[index]))) {
      this.configureOptions();
    }
  }

  ngOnDestroy(): void {
    this.optionsReset.next();
    this.optionsReset.complete();
  }

  private getOptionsSnapshot(): unknown[] {
    return [this.field, this.field.name, this.field.type, this.formGroup.get(this.field.name),
      this.field.availableValues, this.field.availableValues?.length, this.field.displayProperty, this.field.valueProperty,
      this.field.retrieveOptionsUrl, this.field.retrieveOptions?.async,
      this.field.retrieveOptions?.parameter, this.field.retrieveOptions?.characters,
      this.field.retrieveOptions?.responseProperty];
  }

  private configureOptions(): void {
    this.optionsReset.next();
    this.fillProperties();
    let control = this.formGroup.get(this.field.name);
    if (!control) {
      control = new FormControl(null, this.ngxMatFormService.addFieldValidators(this.field));
      this.formGroup.addControl(this.field.name, control);
    }
    this.optionsSnapshot = this.getOptionsSnapshot();
    if (this.field.type === NgxFieldTypes.Autocomplete) {
      this.field.filteredOptions = of([]);
      if (this.field.availableValues?.length) {
        this.setFilteredOptions(control);
      } else if (this.field.retrieveOptionsUrl) {
        this.getDataFromRemote(control);
      } else {
        this.setFilteredOptions(control);
      }
    }
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
      filterValue = String(value[this.displayProperty] ?? '').toLowerCase();
    }
    const responseProperty = this.field.retrieveOptions?.responseProperty;
    const values = Array.isArray(options) ? options : responseProperty ? options?.[responseProperty] : [];
    return Array.isArray(values)
      ? values.filter(option => String(option?.[this.displayProperty] ?? '').toLowerCase().includes(filterValue))
      : [];
  }

  displayFn(option: any): string {
    return typeof option === 'string' ? option : String(option?.[this.field.displayProperty || 'label'] ?? '');
  }

  private setFilteredOptions(control: AbstractControl): void {
    this.field.filteredOptions = defer(() => control.valueChanges.pipe(
      startWith(control.value),
      map(value => this._filter(value || '', this.field.availableValues ?? [])),
      takeUntil(this.optionsReset)
    ));
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
      startWith(control.value),
      distinctUntilChanged(),
      // Every edit cancels the pending timer/request, including clearing the input.
      switchMap(value => {
        this.field.filteredOptions = of([]);
        if (!this.shouldFetchData(value)) return of([]);
        return timer(300).pipe(
          switchMap(() => this.fetchData(value)),
          map(response => this._filter(value, response)),
          catchError(() => of([]))
        );
      }),
      takeUntil(this.optionsReset)
    ).subscribe(options => {
      this.field.filteredOptions = of(options);
    });
  }

  private handleSyncDataRetrieval(control: AbstractControl): void {
    this.ngxMatFormService.retrieveData(this.field.retrieveOptionsUrl || '').pipe(
      catchError(() => of([])),
      takeUntil(this.optionsReset)
    ).subscribe(response => {
      this.field.filteredOptions = defer(() => control.valueChanges.pipe(
        startWith(control.value),
        map(value => this._filter(value || '', response)),
        takeUntil(this.optionsReset)
      ));
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
