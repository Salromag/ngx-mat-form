import {LOCALE_ID, ModuleWithProviders, NgModule} from "@angular/core";
import {NgxMatFormComponent} from "./ngx-mat-form/ngx-mat-form.component";
import {NgxMatFormService} from "./shared/services/ngx-mat-form.service";
import {CommonModule} from "@angular/common";
import {NgxMatFieldComponent} from "./ngx-mat-form/ngx-mat-field/ngx-mat-field.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {NgxMatFormConfig} from "./shared/models/ngx-mat-form-config.model";
import {CONFIG} from './shared/injection-token/config-token';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {provideHttpClient} from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  declarations: [NgxMatFormComponent, NgxMatFieldComponent],
  providers: [
    NgxMatFormService,
    provideNativeDateAdapter(),
    provideHttpClient()
  ],
  exports: [NgxMatFormComponent, NgxMatFieldComponent]
})
export class NgxMatFormModule {
  static forRoot(config = new NgxMatFormConfig()): ModuleWithProviders<NgxMatFormModule> {
    return {
      ngModule: NgxMatFormModule,
      providers: [
        NgxMatFormService,
        provideNativeDateAdapter(),
        {provide: CONFIG, useValue: config},
        {provide: MAT_DATE_LOCALE, useValue: config.locale},
        {provide: LOCALE_ID, useValue: config.locale},
      ]
    };
  }
}
