import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { SearchPaginationService } from 'src/app/services/pagination/search-pagination.service';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: [
    '../../sass/components/_page-card-list.scss',
    './home-search.component.scss',
  ],
})
export class HomeSearchComponent implements OnInit {
  anime: AnimeCatalogo[] = [];
  serie: SerieCatalogo[] = [];
  book: BookCatalogo[] = [];
  page: number = 1
  type!: search
  keySearch!: string
  totalPage = 8

  loadingArray = new Array(8).fill(0);

  softLoading = false;

  constructor(
    public actRoute: ActivatedRoute,
    public searchPagination: SearchPaginationService
  ) {
    this.actRoute.params.subscribe((value) => {
      const { type, page, keySearch } = value;
      this.page = Number.parseInt(page);
      this.type = type.toUpperCase() as search;
      this.keySearch = keySearch as string
      this.softLoading = true
      this.changePage().then(() => {
        this.softLoading = false
      })
    });
  }

  async changePage() {
    let response = await this.searchPagination.pageSearch(
      this.keySearch,
      this.page,
      this.type
    );
    this.anime = []
    this.serie = []
    this.book = []

    switch (this.type) {
      case 'ANIME':
        this.anime = response.result as AnimeCatalogo[]
        break;
      case 'SERIE':
        this.serie = response.result as SerieCatalogo[]
        break;
      case 'BOOK':
        this.book = response.result as BookCatalogo[]
        break;
    }
    this.totalPage = response.totalPage
  }

  ngOnInit() { }
}
