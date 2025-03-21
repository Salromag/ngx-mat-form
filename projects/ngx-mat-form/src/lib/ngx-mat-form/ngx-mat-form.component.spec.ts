import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatFormComponent } from './ngx-mat-form.component';

describe('NgxMatDynamicFormComponent', () => {
  let component: NgxMatFormComponent;
  let fixture: ComponentFixture<NgxMatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxMatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
