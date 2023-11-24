import { TestBed } from '@angular/core/testing';

import { HorarioTrabajoService } from './horario-trabajo.service';

describe('HorarioTrabajoService', () => {
  let service: HorarioTrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioTrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
