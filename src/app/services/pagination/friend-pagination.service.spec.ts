/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FriendPaginationService } from './friend-pagination.service';

describe('Service: FriendPagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FriendPaginationService]
    });
  });

  it('should ...', inject([FriendPaginationService], (service: FriendPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
