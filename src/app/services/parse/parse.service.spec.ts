/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ParseService } from './parse.service';

describe('Service: Parse', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParseService]
    });
  });

  it('should ...', inject([ParseService], (service: ParseService) => {
    expect(service).toBeTruthy();
  }));
});
