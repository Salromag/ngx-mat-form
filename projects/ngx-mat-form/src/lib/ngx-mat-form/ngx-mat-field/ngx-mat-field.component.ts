import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { NgxMatFormService, NgxMatField, NgxFieldTypes } from '../../shared';
import { startWith, map, debounceTime, distinctUntilChanged, filter, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'ngx-mat-field',
  templateUrl: './ngx-mat-field.component.html',
  styleUrls: ['./ngx-mat-field.component.scss'],
  standalone: false,
})
export class NgxMatFieldComponent {
  private ngxMatFormService = inject(NgxMatFormService);

  field = input.required<NgxMatField>();
  formGroup = input.required<FormGroup>();

  // === Derived signals ===
  valueProperty = computed(() =>
    ['select', 'radio', 'autocomplete'].includes(this.field().type)
      ? this.field().valueProperty || 'id'
      : 'id'
  );

  displayProperty = computed(() =>
    ['select', 'radio', 'autocomplete'].includes(this.field().type)
      ? this.field().displayProperty || 'label'
      : 'label'
  );

  // === Filtered options as writable signal ===
  filteredOptions = signal<any[]>([]);

  private control: FormControl;

  constructor() {
    const field = this.field();
    const fg = this.formGroup();

    // Crear o recuperar el control
    this.control = fg.get(field.name) as FormControl;
    if (!this.control) {
      this.control = new FormControl(null);
      fg.addControl(field.name, this.control);
    }

    // Configurar autocomplete si aplica
    if (field.type === NgxFieldTypes.Autocomplete) {
      if (field.availableValues?.length) {
        this.handleLocalAutocomplete();
      } else if (field.retrieveOptionsUrl) {
        this.handleRemoteAutocomplete();
      }
    }
  }

  // === Local autocomplete ===
  private handleLocalAutocomplete(): void {
    const available = this.field().availableValues ?? [];

    effect(() => {
      this.control.valueChanges
        .pipe(startWith(this.control.value))
        .subscribe(value => {
          this.filteredOptions.set(this._filter(value || '', available));
        });
    });
  }

  // === Remote autocomplete ===
  private handleRemoteAutocomplete(): void {
    const field = this.field();
    const control = this.control;

    effect(() => {
      control.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          filter(value => this.shouldFetchData(value)),
          switchMap(value =>
            this.fetchData(value).pipe(
              catchError(() => of([])),
              map(response => this._filter(control.value, response || []))
            )
          )
        )
        .subscribe(result => {
          this.filteredOptions.set(result);
        });
    });
  }

  private shouldFetchData(value: any): boolean {
    const minChars = this.field().retrieveOptions?.characters || 0;
    return typeof value === 'string' && value.length >= minChars;
  }

  private fetchData(value: any) {
    const field = this.field();
    if (!field.retrieveOptionsUrl) return of([]);

    const paramKey = field.retrieveOptions?.parameter;
    if (!paramKey) return of([]);

    const params = { [paramKey]: value };
    return this.ngxMatFormService.retrieveData(field.retrieveOptionsUrl, params);
  }

  // === Helpers ===
  private _filter(value: any, options: any[]): any[] {
    const displayKey = this.displayProperty();
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.[displayKey]?.toLowerCase() || '';
  
    const responseKey: any = this.field().retrieveOptions?.responseProperty;
    const items = responseKey ? (options[responseKey] ?? []) : options;
  
    return items.filter((opt: any) =>
      (opt[displayKey] ?? '').toLowerCase().includes(filterValue)
    );
  }
  

  displayFn = (option: any): string => option ? option[this.displayProperty()] : '';

  getValidatorValue(field: NgxMatField, validatorName: string): any {
    const validatorConfig = field.validators?.find(v => v.validator === validatorName);
    return validatorConfig ? validatorConfig.value : null;
  }
}
