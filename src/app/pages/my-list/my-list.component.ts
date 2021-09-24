import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { MyListPaginationService } from 'src/app/services/pagination/my-list-pagination.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: [
    '../../sass/components/_page-card-list.scss',
    './my-list.component.scss',
  ],
})
export class MyListComponent implements OnInit, OnDestroy {
  anime: { anime: AnimeCatalogo; content: content }[] = [];
  serie: { serie: SerieCatalogo; content: content }[] = [];
  book: { book: BookCatalogo; content: content }[] = [];
  page: number = 1
  totalPage: number = 0
  observable: Subscription

  loadingArray = new Array(12).fill(0);

  type!: search;

  constructor(
    actRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private myListPagination: MyListPaginationService,
  ) {
    this.observable = actRoute.params.subscribe((value) => {
      if (this.type != null && this.type != value.type.toUpperCase()) {
        this.myListPagination.clean()
      }
      this.type = value.type.toUpperCase();
      this.page = Number.parseInt(value.page)
      loadingService.isLoading = true
      this.changePage().then(() => {
        loadingService.isLoading = false
      })
    });
  }
  ngOnDestroy(): void {
    this.observable.unsubscribe()
  }

  async changePage() {
    let response = await this.myListPagination.myListPage(
      this.page,
      this.type
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
