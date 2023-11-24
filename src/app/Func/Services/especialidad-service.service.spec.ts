import { TestBed } from '@angular/core/testing';

import { EspecialidadServiceService } from './especialidad-service.service';

describe('EspecialidadServiceService', () => {
  let service: EspecialidadServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecialidadServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
