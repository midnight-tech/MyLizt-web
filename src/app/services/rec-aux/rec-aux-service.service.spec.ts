/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecAuxService } from './rec-aux-service.service';

describe('Service: RecAuxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecAuxService]
    });
  });

  it('should ...', inject([RecAuxService], (service: RecAuxService) => {
    expect(service).toBeTruthy();
  }));
});
