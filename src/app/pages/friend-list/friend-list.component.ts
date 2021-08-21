import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { FriendListPaginationService } from 'src/app/services/pagination/friend-list-pagination.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: [
    '../../sass/components/_page-card-list.scss',
    './friend-list.component.scss',
  ],
})
export class FriendListComponent implements OnInit {
  type!: search;
  friendId: string = '';
  friendName: string = '';
  page: number = 1;
  totalPage: number = -1;

  anime: { anime: AnimeCatalogo; content: content }[] = [];
  serie: { serie: SerieCatalogo; content: content }[] = [];
  book: { book: BookCatalogo; content: content }[] = [];

  loadingArray = new Array(12).fill(0);

  constructor(
    actRoute: ActivatedRoute,
    public homeContext: HomeContextService,
    public loadingService: LoadingService,
    private userService: UserService,
    private friendListPagination: FriendListPaginationService
  ) {
    actRoute.params.subscribe((value) => {
      if (this.type != null && this.type != value.type.toUpperCase()) {
        this.friendListPagination.clean()
      }
      this.type = value.type.toUpperCase() as search;
      this.friendId = value.friendId;
      this.page = Number.parseInt(value.page);
      this.userService.getUserName(this.friendId).then((name) => {
        this.friendName = name;
      });
      loadingService.isLoading = true
      this.changePage().then(() => {
        loadingService.isLoading = false
      })
    });
  }

  async changePage() {
    let response = await this.friendListPagination.friendListPage(
      this.page,
      this.type,
      this.friendId
    );
    this.anime = []
    this.serie = []
    this.book = []
    this.totalPage = 0
    switch (this.type) {
      case 'ANIME':
        this.anime = response.result as { anime: AnimeCatalogo; content: content; }[];
        break;
      case 'SERIE':
        this.serie = response.result as { serie: SerieCatalogo; content: content; }[];
        break;
      case 'BOOK':
        this.book = response.result as { book: BookCatalogo; content: content; }[]
        break;
    }
    this.totalPage = response.totalPage
  }

  ngOnInit() { }
}
