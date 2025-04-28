import { TestBed } from '@angular/core/testing';

import { PlateService } from './plate.service';

describe('PlateService', () => {
  let service: PlateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
