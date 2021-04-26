/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FriendListPaginationService } from './friend-list-pagination.service';

describe('Service: FriendListPagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FriendListPaginationService]
    });
  });

  it('should ...', inject([FriendListPaginationService], (service: FriendListPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
