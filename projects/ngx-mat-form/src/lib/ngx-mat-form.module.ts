import {NgModule} from "@angular/core";
import {NgxMatFormComponent} from "./ngx-mat-form/ngx-mat-form.component";
import {NgxMatFormService} from "./shared/services/ngx-mat-form.service";
import {CommonModule} from "@angular/common";
import {NgxMatFieldComponent} from "./ngx-mat-form/ngx-mat-field/ngx-mat-field.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  declarations: [NgxMatFormComponent, NgxMatFieldComponent],
  providers: [NgxMatFormService],
  exports: [NgxMatFormComponent, NgxMatFieldComponent]
})
export class NgxMatFormModule {

}
