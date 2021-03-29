/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HomeContextService } from './home.service';

describe('Service: Home', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeContextService]
    });
  });

  it('should ...', inject([HomeContextService], (service: HomeContextService) => {
    expect(service).toBeTruthy();
  }));
});
