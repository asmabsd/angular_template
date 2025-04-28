import { TestBed } from '@angular/core/testing';

import { StatsallService } from './statsall.service';

describe('StatsallService', () => {
  let service: StatsallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatsallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
