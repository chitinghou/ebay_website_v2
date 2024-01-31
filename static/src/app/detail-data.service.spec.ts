import { TestBed } from '@angular/core/testing';

import { DetailDataService } from './detail-data.service';

describe('DetailDataService', () => {
  let service: DetailDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
