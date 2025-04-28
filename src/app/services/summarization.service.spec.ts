import { TestBed } from '@angular/core/testing';

import { SummarizationService } from './summarization.service';

describe('SummarizationService', () => {
  let service: SummarizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummarizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
