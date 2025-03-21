import { TestBed } from '@angular/core/testing';

import { NgxMatDynamicFormService } from './ngx-mat-dynamic-form.service';

describe('NgxMatDynamicFormService', () => {
  let service: NgxMatDynamicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMatDynamicFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
