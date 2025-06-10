import { TestBed } from '@angular/core/testing';

import { ExportToExcel } from './export-to-excel';

describe('ExportToExcel', () => {
  let service: ExportToExcel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportToExcel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
