/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CatalogoPaginationService } from './catalogo-pagination.service';

describe('Service: CatalogoPagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogoPaginationService]
    });
  });

  it('should ...', inject([CatalogoPaginationService], (service: CatalogoPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
