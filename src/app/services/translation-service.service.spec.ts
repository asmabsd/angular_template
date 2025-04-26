import { TestBed } from '@angular/core/testing';

import { TranslationServiceService } from './translation-service.service';

describe('TranslationServiceService', () => {
  let service: TranslationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
