import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { search, UserInterface } from 'src/app/data/interfaces';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
  isActiveAdd = false;
  isActiveRemove = false;
  friends: {
    user: UserInterface;
    aniCount: number;
    serieCount: number;
    bookCount: number;
  }[] = [];
  id = new FormControl('');

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getFriend().then((friends) => {
      const friendsPromises = friends.map(async (friend) => {
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
      Promise.all(friendsPromises).then((value) => {
        this.friends = value;
      });
    });
  }

  showAddFriends() {
    if (this.isActiveAdd) {
      this.id.setValue('');
    }
    this.isActiveAdd = !this.isActiveAdd;
  }

  sendFriendRquest() {
    this.userService.sendFriendRequest(this.id.value).then((value) => {
      console.log(value);
      if (value) {
        // ok
      }
    });
  }

  removeFriend() {
    this.userService.removeFriend(this.id.value).then((value) => {
      console.log(value);
    });
  }

  showRemoveFriends() {
    if (this.isActiveRemove) {
      this.id.setValue('');
    }
    this.isActiveRemove = !this.isActiveRemove;
  }

  redirectToFriendList(friendId: string, type: search) {
    this.router.navigate(['home', 'friend-list', friendId, type.toLowerCase()]);
  }

  getFriendContentQuant(friend: UserInterface, type: search) {}
}
