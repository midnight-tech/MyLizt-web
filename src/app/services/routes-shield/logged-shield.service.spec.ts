/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoggedShieldService } from './logged-shield.service';

describe('Service: LoggedShield', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedShieldService]
    });
  });

  it('should ...', inject([LoggedShieldService], (service: LoggedShieldService) => {
    expect(service).toBeTruthy();
  }));
});
