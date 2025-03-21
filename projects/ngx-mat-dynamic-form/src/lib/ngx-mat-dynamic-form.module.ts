import {NgModule} from "@angular/core";
import {NgxMatDynamicFormComponent} from "./ngx-mat-dynamic-form/ngx-mat-dynamic-form.component";
import {NgxMatDynamicFormService} from "./shared/services/ngx-mat-dynamic-form.service";
import {CommonModule} from "@angular/common";
import {NgxMatFieldComponent} from "./ngx-mat-dynamic-form/ngx-mat-field/ngx-mat-field.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  declarations: [NgxMatDynamicFormComponent, NgxMatFieldComponent],
  providers: [NgxMatDynamicFormService],
  exports: [NgxMatDynamicFormComponent, NgxMatFieldComponent]
})
export class NgxMatDynamicFormModule {

}
