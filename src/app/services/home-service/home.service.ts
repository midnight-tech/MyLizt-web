import { Injectable } from '@angular/core';
import axios from 'axios';
import { bookCatalogo, CatalogoAnime, search, serieCatalogo } from 'src/app/data/interfaces';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  page = 1
  totalPage = 0;
  animeResult: CatalogoAnime[] = []
  serieResult: serieCatalogo[] = []
  bookResult: bookCatalogo[] = []
  lastPageSerie: number | null = null
  seriePages: serieCatalogo[][] = []

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
    if (Math.ceil(page / 5) != this.lastPageSerie) {
      let result = await this.serieService.search(query, Math.ceil(page / 5))
      this.seriePages = result.pages
      this.lastPageSerie = Math.ceil(page / 5)
    }
    this.serieResult = this.seriePages[page % 5]
  }
}
