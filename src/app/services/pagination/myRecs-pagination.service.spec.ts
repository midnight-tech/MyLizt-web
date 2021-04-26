/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyRecsPaginationService } from './myRecs-pagination.service';

describe('Service: MyRecsPagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyRecsPaginationService]
    });
  });

  it('should ...', inject([MyRecsPaginationService], (service: MyRecsPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
