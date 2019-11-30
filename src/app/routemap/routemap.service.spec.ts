import { TestBed } from '@angular/core/testing';

import { RoutemapService } from './routemap.service';

describe('RoutemapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutemapService = TestBed.get(RoutemapService);
    expect(service).toBeTruthy();
  });
});
