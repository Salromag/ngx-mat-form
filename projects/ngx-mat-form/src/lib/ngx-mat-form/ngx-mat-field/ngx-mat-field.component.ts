import {Component, Input, OnInit} from "@angular/core";
import {NgxFieldTypes, NgxMatField} from "../../shared";
import {FormGroup} from "@angular/forms";

@Component({
  selector: "ngx-mat-field",
  templateUrl: "./ngx-mat-field.component.html",
  styleUrls: ["./ngx-mat-field.component.scss"],
  standalone: false
})
export class NgxMatFieldComponent implements OnInit {
  @Input() field: NgxMatField;
  @Input() formGroup: FormGroup;

  matSelectValue: string;
  matSelectDisplay: string;
  radioValueProperty: string;
  radioDisplayProperty: string;

  constructor() {
  }

  ngOnInit(): void {
    if (!this.formGroup.contains(this.field.name)) {
      this.formGroup.addControl(this.field.name, this.formGroup.get(this.field.name));
    }
    this.fillProperties();
  }

  getValidatorValue(field: NgxMatField, validatorName: string): any {
    const validatorConfig = field.validators?.find((v: any) => v.validator === validatorName);
    return validatorConfig ? validatorConfig.value : null;
  }

  private fillProperties(): void {
    if (this.field.type === NgxFieldTypes.Select) {
      this.matSelectValue = this.field.valueProperty || 'id';
      this.matSelectDisplay = this.field.displayProperty || 'label';
    }

    if (this.field.type === NgxFieldTypes.Radio) {
      this.radioValueProperty = this.field.valueProperty || 'id';
      this.radioDisplayProperty = this.field.displayProperty || 'label';
    }
  }
}
