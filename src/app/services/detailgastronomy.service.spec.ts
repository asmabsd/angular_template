import { TestBed } from '@angular/core/testing';

import { DetailgastronomyService } from './detailgastronomy.service';

describe('DetailgastronomyService', () => {
  let service: DetailgastronomyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailgastronomyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
