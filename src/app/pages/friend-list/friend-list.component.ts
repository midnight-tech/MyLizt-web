import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { search } from 'src/app/data/interfaces';
import { HomeContextService } from 'src/app/services/home-context/home.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {

  type: string = ""
  friendId: string = ""

  constructor(
    actRoute: ActivatedRoute,
    public homeContext: HomeContextService,

  ) {
    actRoute.params.subscribe((value) => {
      this.type = value.type
      this.friendId = value.friendId
      homeContext.cleanContentMyList()
      this.homeContext.changePage(1, 'friendList', this.type.toUpperCase() as search,this.friendId)
    })
  }

  ngOnInit() {
  }

}
