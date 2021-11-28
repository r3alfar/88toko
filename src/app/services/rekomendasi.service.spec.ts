import { TestBed } from '@angular/core/testing';

import { RekomendasiService } from './rekomendasi.service';

describe('RekomendasiService', () => {
  let service: RekomendasiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RekomendasiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
