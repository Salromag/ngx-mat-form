import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatDynamicFormComponent } from './ngx-mat-dynamic-form.component';

describe('NgxMatDynamicFormComponent', () => {
  let component: NgxMatDynamicFormComponent;
  let fixture: ComponentFixture<NgxMatDynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatDynamicFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxMatDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
