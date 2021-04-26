import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {

  type!: search
  friendId: string = ""

  anime : {anime : AnimeCatalogo, content : content}[] = []
  serie : {serie : SerieCatalogo, content : content}[] = []
  book : {book : BookCatalogo, content : content}[] = []

  constructor(
    actRoute: ActivatedRoute,
    public homeContext: HomeContextService,

  ) {
    actRoute.params.subscribe((value) => {
      this.type = value.type.toUpperCase() as search
      this.friendId = value.friendId
    })
  }

  ngOnInit() {
  }

}
