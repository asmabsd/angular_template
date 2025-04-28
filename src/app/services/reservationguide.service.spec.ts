import { TestBed } from '@angular/core/testing';

import { ReservationguideService } from './reservationguide.service';

describe('ReservationguideService', () => {
  let service: ReservationguideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationguideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
