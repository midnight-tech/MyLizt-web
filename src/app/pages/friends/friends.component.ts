import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserInterface } from 'src/app/data/interfaces';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
  isActiveAdd = false;
  isActiveRemove = false;
  friends: UserInterface[] = [];
  id = new FormControl('');

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.userService.getFriend().then((value) => {
      this.friends = value;
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
}
