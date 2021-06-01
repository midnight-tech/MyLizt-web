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
  update = true

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {
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
          this.update = !this.update
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

}
