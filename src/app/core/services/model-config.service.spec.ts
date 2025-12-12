import { TestBed } from '@angular/core/testing';

import { ModelConfigService } from './model-config.service';

describe('ModelConfigService', () => {
  let service: ModelConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
