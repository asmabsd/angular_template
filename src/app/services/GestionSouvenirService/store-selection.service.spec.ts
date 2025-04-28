import { TestBed } from '@angular/core/testing';

import { StoreSelectionService } from './store-selection.service';

describe('StoreSelectionService', () => {
  let service: StoreSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
