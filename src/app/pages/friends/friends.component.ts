import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
  isActiveAdd = false;
  isActiveRemove = false;

  constructor() {}

  ngOnInit() {}

  showAddFriends() {
    this.isActiveAdd = !this.isActiveAdd;
  }

  showRemoveFriends() {
    this.isActiveRemove = !this.isActiveRemove;
  }
}
