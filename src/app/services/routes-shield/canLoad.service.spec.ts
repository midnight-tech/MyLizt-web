/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CanLoadService } from './canLoad.service';

describe('Service: CanLoad', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanLoadService]
    });
  });

  it('should ...', inject([CanLoadService], (service: CanLoadService) => {
    expect(service).toBeTruthy();
  }));
});
