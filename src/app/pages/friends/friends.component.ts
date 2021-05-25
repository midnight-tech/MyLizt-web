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
  loading = false
  selectedId = ""

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {
    this.getFriends()
  }

  getFriends() {
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
    let id: string = this.id.value
    this.userService.sendFriendRequest(id.toLowerCase().replace("#", "")).then((value) => {
      if (value) {
        this.showAddFriends()
        this.friends = []
        this.getFriends()
      }
    });
  }

  removeFriend() {
    let id: string = this.id.value.toLowerCase().replace("#", "")
    if (id != this.selectedId) {
      return
    }
    if (!this.loading) {
      this.loading = true
      this.userService.removeFriend(id).then((value) => {
        if (value) {
          this.showRemoveFriends()
          this.friends = []
          this.getFriends()
        }
        this.loading = false
      });
    }
  }

  showRemoveFriends(friendId?: string) {
    if (this.isActiveRemove) {
      this.id.setValue('');
      this.selectedId = ""
    }
    this.selectedId = friendId?.toLocaleLowerCase().replace("#", "")!
    this.isActiveRemove = !this.isActiveRemove;
  }

  redirectToFriendList(friendId: string, type: search) {
    this.router.navigate(['home', 'friend-list', friendId, type.toLowerCase()]);
  }

  getFriendContentQuant(friend: UserInterface, type: search) { }
}
