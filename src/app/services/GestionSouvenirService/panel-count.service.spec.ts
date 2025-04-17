import { TestBed } from '@angular/core/testing';

import { PanelCountService } from './panel-count.service';

describe('PanelCountService', () => {
  let service: PanelCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
