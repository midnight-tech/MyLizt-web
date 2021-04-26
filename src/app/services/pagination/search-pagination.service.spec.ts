/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SearchPaginationService } from './search-pagination.service';

describe('Service: SearchPagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchPaginationService]
    });
  });

  it('should ...', inject([SearchPaginationService], (service: SearchPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
