import { TestBed } from '@angular/core/testing';

import { NgxMatFormService } from './ngx-mat-form.service';

describe('NgxMatDynamicFormService', () => {
  let service: NgxMatFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMatFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
