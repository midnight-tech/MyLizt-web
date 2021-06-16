import { Injectable } from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root',
})
export class SearchPaginationService {
  page = 0;
  totalPage = 0;
  lastPageSerie: number | null = null;
  seriePages: SerieCatalogo[][] = [];

  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService
  ) { }

  cleanPage() {
    this.seriePages = [];
    this.lastPageSerie = null;
  }

  async pageSearch(
    query: string,
    page: number = 1,
    searchType: search,
  ) {
    this.page = page;
    switch (searchType) {
      case 'ANIME':
        let valueAnime = await this.animeService.search(query, page);
        return { result: valueAnime.content, totalPage: valueAnime.lastPage };
      case 'BOOK':
        let valueBook = await this.bookService.search(query, page);
        return { result: valueBook.content, totalPage: valueBook.lastPage };
      case 'SERIE':
        let valueSerie = await this.seriePageManager(query, page);
        return { result: valueSerie, totalPage: this.totalPage };
    }
  }

  async seriePageManager(query: string, page: number) {
    if (
      this.lastPageSerie == null ||
      Math.ceil(page / 5) != this.lastPageSerie
    ) {
      let result = await this.serieService.search(query, Math.ceil(page / 5));
      this.seriePages = result.pages;
      this.totalPage = result.lastPage;
      this.lastPageSerie = Math.ceil(page / 5);
    }
    return this.seriePages[(page - 1) % 5];
  }
}
