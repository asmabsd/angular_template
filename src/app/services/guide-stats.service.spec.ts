import { TestBed } from '@angular/core/testing';

import { GuideStatsService } from './guide-stats.service';

describe('GuideStatsService', () => {
  let service: GuideStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuideStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
