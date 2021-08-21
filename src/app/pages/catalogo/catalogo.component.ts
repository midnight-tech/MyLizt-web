import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { CatalogoPaginationService } from 'src/app/services/pagination/catalogo-pagination.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: [
    '../../sass/components/_page-card-list.scss',
    './catalogo.component.scss',
  ],
})
export class CatalogoComponent implements OnInit, OnChanges {
  type!: search;
  anime: AnimeCatalogo[] = [];
  serie: SerieCatalogo[] = [];
  book: BookCatalogo[] = [];
  page: number = 1
  totalPage: number = 8

  softLoading = false;

  loadingArray = new Array(8).fill(0);

  constructor(
    public homeContext: HomeContextService,
    public actRoute: ActivatedRoute,
    public catalogoPagination: CatalogoPaginationService
  ) {
    this.actRoute.params.subscribe((value) => {
      const { type, page } = value;
      this.page = Number.parseInt(page);
      this.type = value.type.toUpperCase() as search;
      this.softLoading = true
      this.changePage().then(() => {
        this.softLoading = false
      })
    });
  }

  async changePage() {
    let response = await this.catalogoPagination.pageCatalogo(this.page, this.type)
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

  async ngOnChanges(changes: SimpleChanges) {
  }



  ngOnInit() {
  }
}
