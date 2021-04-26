import { Injectable } from '@angular/core';
import { search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogoPaginationService {
  page = 0;
  totalPage = 0;
  lastPageSerie: number | null = null;
  seriePages: SerieCatalogo[][] = [];

  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService
  ) {}

  async pageCatalogo(page: number = 1, searchType: search) {
    switch (searchType) {
      case 'ANIME':
        const animeValue = await this.animeService.getCatalogo(page);
        return {
          result: animeValue.anime,
          totalPage: animeValue.lastPage,
        };
      case 'BOOK':
        const bookValue = await this.bookService.getCatalogo(page);
        return {
          result: bookValue.content,
          totalPage: bookValue.lastPage,
        };
      case 'SERIE':
        const serieValue = await this.seriePageManagerCatalogo(page);
        return {
          result: serieValue,
          totalPage: this.totalPage,
        };
    }
  }

  async seriePageManagerCatalogo(page: number) {
    if (
      this.lastPageSerie == null ||
      Math.ceil(page / 5) != this.lastPageSerie
    ) {
      let result = await this.serieService.getCatalogo(Math.ceil(page / 5));
      this.seriePages = result.pages;
      this.totalPage = result.lastPage;
      this.lastPageSerie = Math.ceil(page / 5);
    }
    return this.seriePages[(page - 1) % 5];
  }
}
