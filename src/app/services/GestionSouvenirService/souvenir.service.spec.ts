import { TestBed } from '@angular/core/testing';

import { SouvenirService } from './souvenir.service';

describe('SouvenirService', () => {
  let service: SouvenirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SouvenirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
