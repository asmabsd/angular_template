import { TestBed } from '@angular/core/testing';

import { ReservationchambreService } from './reservationchambre.service';

describe('ReservationchambreService', () => {
  let service: ReservationchambreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationchambreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
