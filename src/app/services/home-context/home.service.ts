import { Injectable } from '@angular/core';
import axios from 'axios';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { CatalogoAnimeInterface, search, SerieCatalogoInterface } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root'
})
export class HomeContextService {

  page = 1
  totalPage = 0;
  animeResult: AnimeCatalogo[] = []
  serieResult: SerieCatalogo[] = []
  bookResult: BookCatalogo[] = []
  lastPageSerie: number | null = null
  seriePages: SerieCatalogo[][] = []

  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService,
  ) { }

  clearContents() {
    this.animeResult = []
    this.serieResult = []
    this.bookResult = []
  }

  pageSearch(query: string, page: number = 1, searchType: search) {
    this.clearContents()
    switch (searchType) {
      case 'ANIME':
        this.animeService.search(query, page).then((value) => {
          this.animeResult = value.content
          this.totalPage = value.lastPage
        })
        break;
      case 'BOOK':
        this.bookService.search(query, page).then((value) => {
          this.bookResult = value.content
          this.totalPage = value.lastPage
        })
        break;
      case 'SERIE':
        this.seriePageManager(query, page)
        break;
    }
  }


  async seriePageManager(query: string, page: number) {
    if (this.lastPageSerie == null || Math.ceil(page / 5) != this.lastPageSerie) {
      let result = await this.serieService.search(query, Math.ceil(page / 5))
      this.seriePages = result.pages
      this.lastPageSerie = Math.ceil(page / 5)
    }
    this.serieResult = this.seriePages[(page % 5) - 1]
  }
}
