/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyListPaginationService } from './my-list-pagination.service';

describe('Service: MyListPagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyListPaginationService]
    });
  });

  it('should ...', inject([MyListPaginationService], (service: MyListPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
