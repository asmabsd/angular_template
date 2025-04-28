import { TestBed } from '@angular/core/testing';

import { StatsGastronomyService } from './stats-gastronomy.service';

describe('StatsGastronomyService', () => {
  let service: StatsGastronomyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatsGastronomyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
