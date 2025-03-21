import {Component} from '@angular/core';
import {NgxMatDynamicFormModule} from "../../../ngx-mat-dynamic-form/src/lib/ngx-mat-dynamic-form.module";
import {DynamicFormSchema} from "../../../ngx-mat-dynamic-form/src/lib/shared";
import {NgxMatDynamicForm, NgxMatDynamicFormService} from "ngx-mat-dynamic-form";

@Component({
  selector: 'docs-app',
  imports: [NgxMatDynamicFormModule],
  providers: [NgxMatDynamicFormService],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  schema: NgxMatDynamicForm;
  constructor() {
  }

  ngOnInit() {
    this.schema = DynamicFormSchema
  }

}
