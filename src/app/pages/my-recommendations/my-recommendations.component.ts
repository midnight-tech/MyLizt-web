import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { MyRecsPaginationService } from 'src/app/services/pagination/myRecs-pagination.service';
import { RecAuxService } from 'src/app/services/rec-aux/rec-aux-service.service';

@Component({
  selector: 'app-my-recommendations',
  templateUrl: './my-recommendations.component.html',
  styleUrls: [
    '../../sass/components/_page-card-list.scss',
    './my-recommendations.component.scss',
  ],
})
export class MyRecommendationsComponent implements OnInit, OnDestroy {
  anime: { anime: AnimeCatalogo; content: content }[] = [];
  serie: { serie: SerieCatalogo; content: content }[] = [];
  book: { book: BookCatalogo; content: content }[] = [];

  sub: Subscription

  page: number = 1
  totalPage: number = -1

  type!: search;

  loadingArray = new Array(12).fill(0);

  constructor(
    public homeContext: HomeContextService,
    actRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private myRecPagination: MyRecsPaginationService,
    private recAuxService: RecAuxService
  ) {
    this.sub = actRoute.params.subscribe((value) => {
      if (this.type != null && this.type != value.type.toUpperCase()) {
        this.myRecPagination.clean()
        this.recAuxService.destroy()
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
    this.myRecPagination.clean()
    this.sub.unsubscribe()
    this.recAuxService.destroy()
  }

  async changePage() {
    let response = await this.myRecPagination.MyRecListPage(
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
