import { TestBed } from '@angular/core/testing';

import { GastronomyService } from './gastronomy.service';

describe('GastronomyService', () => {
  let service: GastronomyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GastronomyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
