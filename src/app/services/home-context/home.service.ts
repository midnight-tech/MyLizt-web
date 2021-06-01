import { Injectable } from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import {
  CompleteAnime,
  CompleteBook,
  CompleteSerie,
  search,
} from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { ListService } from '../list/list.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root',
})
export class HomeContextService {
  page = 1;
  totalPage = 0;
  animeResult: AnimeCatalogo[] = [];
  serieResult: SerieCatalogo[] = [];
  bookResult: BookCatalogo[] = [];
  lastPageSerie: number | null = null;
  seriePages: SerieCatalogo[][] = [];
  public query = '';
  public searchType?: search = 'ANIME';
  private detailContent: CompleteAnime | CompleteSerie | CompleteBook | null;

  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService,
    public listService: ListService
  ) {
    this.detailContent = null;
  }

  setDetail(detail: CompleteAnime | CompleteSerie | CompleteBook) {
    this.detailContent = detail;
  }

  getDetail() {
    return this.detailContent;
  }

  initContent() {
    this.page = 1;
    this.totalPage = 0;
    this.query = '';
    this.searchType = 'ANIME';
    this.lastPageSerie = null;
  }
}