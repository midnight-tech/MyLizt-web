/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnloggedShieldService } from './unlogged-shield.service';

describe('Service: UnloggedShield', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnloggedShieldService]
    });
  });

  it('should ...', inject([UnloggedShieldService], (service: UnloggedShieldService) => {
    expect(service).toBeTruthy();
  }));
});
