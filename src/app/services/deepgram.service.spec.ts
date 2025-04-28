import { TestBed } from '@angular/core/testing';

import { DeepgramService } from './deepgram.service';

describe('DeepgramService', () => {
  let service: DeepgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeepgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
