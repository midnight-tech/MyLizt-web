import { Component, OnInit } from '@angular/core';
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
  friends : UserInterface[] = []

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.userService.getFriend().then((value)=>{
      this.friends = value
    })
  }

  showAddFriends() {
    this.isActiveAdd = !this.isActiveAdd;
  }

  showRemoveFriends() {
    this.isActiveRemove = !this.isActiveRemove;
  }
}
