import { TestBed } from '@angular/core/testing';

import { PhotosServiceService } from './photos-service.service';

describe('PhotosServiceService', () => {
  let service: PhotosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
