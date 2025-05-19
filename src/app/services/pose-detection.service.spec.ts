import { TestBed } from '@angular/core/testing';

import { PoseDetectionService } from './pose-detection.service';

describe('PoseDetectionService', () => {
  let service: PoseDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoseDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
