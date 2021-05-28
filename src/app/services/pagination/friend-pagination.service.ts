import { Injectable } from '@angular/core';
import { UserInterface } from 'src/app/data/interfaces';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FriendPaginationService {

  constructor(
    private userService: UserService
  ) { }

  friendList?: {
    user: UserInterface;
    aniCount: any
    serieCount: any
    bookCount: any
  }[][]
  loadedPage = 0;

  clean() {
    this.friendList = undefined
    this.loadedPage = 0
  }

  async friendPagination(page: number) {
    if (this.friendList == undefined) {
      this.friendList = []
      const friends = await this.userService.getFriend()
      const friendsFormated = await Promise.all(this.getFriendsCount(friends))
      this.friendList.push(friendsFormated)
      this.loadedPage = 1
      return this.friendList[0]
    }
    if (page <= this.loadedPage) {
      return this.friendList[page - 1]
    }
    let lastElement = this.friendList[this.friendList.length - 1][11]
    if (lastElement == undefined) {
      return []
    }
    const friends = await this.userService.getFriend(lastElement.user)
    if (friends.length == 0) {
      return [];
    }
    this.friendList.push(await Promise.all(this.getFriendsCount(friends)))
    return this.friendList[page - 1]
  }

  getFriendsCount(friends: UserInterface[]) {
    return friends.map(async (friend) => {
      const friendList = await friend.myList.get();
      return {
        user: friend,
        aniCount:
          friendList.data()!.animeCount == undefined
            ? 0
            : friendList.data()!.animeCount,
        serieCount:
          friendList.data()!.serieCount == undefined
            ? 0
            : friendList.data()!.serieCount,
        bookCount:
          friendList.data()!.bookCount == undefined
            ? 0
            : friendList.data()!.bookCount,
      };
    });
  }

}
