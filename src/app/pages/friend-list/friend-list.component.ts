import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {

  type!: search
  friendId: string = ""
  friendName : string = ""

  anime : {anime : AnimeCatalogo, content : content}[] = []
  serie : {serie : SerieCatalogo, content : content}[] = []
  book : {book : BookCatalogo, content : content}[] = []


  loadingArray = new Array(12).fill(0)

  constructor(
    actRoute: ActivatedRoute,
    public homeContext: HomeContextService,
    public loadingService : LoadingService,
    private userService : UserService

  ) {
    actRoute.params.subscribe((value) => {
      this.type = value.type.toUpperCase() as search
      this.friendId = value.friendId
      this.userService.getUserName(this.friendId).then((name)=>{
        this.friendName = name
      })
    })
  }

  ngOnInit() {
  }

}
