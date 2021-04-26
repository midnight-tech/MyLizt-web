import { Injectable } from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { ListService } from '../list/list.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root',
})
export class MyRecsPaginationService {
  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService,
    public listService: ListService
  ) {}

  myRecAnimeAuxPage?: content[][];
  myRecSerieAuxPage?: content[][];
  myRecBookAuxPage?: content[][];

  async MyRecListPage(page: number, type: search) {
    if (type == 'ANIME') {
      if (!this.myRecAnimeAuxPage) {
        this.myRecAnimeAuxPage = [];
        const animeContent = await this.listService.getMyRecommendatation(
          type as search
        );
        if (animeContent == false) {
          return false;
        }
        for (let i = 0, j = animeContent.length; i < j; i += 12) {
          this.myRecAnimeAuxPage.push(animeContent.slice(i, i + 12));
        }
        const result = this.myRecAnimeAuxPage[page - 1].map(
          async (value, index) => {
            const animeRaw = await this.animeService.getAnimeComplete(
              value.contentId as number,
              index
            );
            const anime = new AnimeCatalogo(undefined, undefined, animeRaw);
            return { anime, content: value };
          }
        );
        return {
          result: await Promise.all(result),
          totalPage: this.myRecAnimeAuxPage.length,
        };
      }
      if (page <= this.myRecAnimeAuxPage.length) {
        if (this.myRecAnimeAuxPage.length == 0) {
          return false;
        }
        const result = this.myRecAnimeAuxPage[page - 1].map(
          async (value, index) => {
            const animeRaw = await this.animeService.getAnimeComplete(
              value.contentId as number,
              index
            );
            const anime = new AnimeCatalogo(undefined, undefined, animeRaw);
            return { anime, content: value };
          }
        );
        return {
          result: await Promise.all(result),
          totalPage: this.myRecAnimeAuxPage.length,
        };
      } else {
        const animeQuery = await this.listService.getMyRecommendatation(
          type,
          this.myRecAnimeAuxPage[this.myRecAnimeAuxPage.length - 1][
            this.myRecAnimeAuxPage[this.myRecAnimeAuxPage.length - 1].length - 1
          ]
        );
        if (animeQuery == false) {
          return false;
        }
        for (let i = 0, j = animeQuery.length; i < j; i += 12) {
          this.myRecAnimeAuxPage.push(animeQuery.slice(i, i + 12));
        }
        const result = this.myRecAnimeAuxPage[page - 1].map(
          async (value, index) => {
            const animeRaw = await this.animeService.getAnimeComplete(
              value.contentId as number,
              index
            );
            const anime = new AnimeCatalogo(undefined, undefined, animeRaw);
            return { anime, content: value };
          }
        );
        return {
          result: await Promise.all(result),
          totalPage: this.myRecAnimeAuxPage.length,
        };
      }
    } else if (type == 'SERIE') {
      if (!this.myRecSerieAuxPage) {
        this.myRecSerieAuxPage = [];
        const firstWave = await this.listService.getMyRecommendatation(
          type as search
        );
        if (firstWave == false) {
          return false;
        }
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.myRecSerieAuxPage.push(firstWave.slice(i, i + 12));
        }
        const result = this.myRecSerieAuxPage[page - 1].map(
          async (value, index) => {
            const serieComplete = await this.serieService.getSerieComplete(
              value.contentId as number
            );
            const serie = new SerieCatalogo(
              undefined,
              undefined,
              serieComplete
            );
            return { serie, content: value };
          }
        );
        return {
          result: await Promise.all(result),
          totalPage: this.myRecSerieAuxPage.length,
        };
      }
      if (page <= this.myRecSerieAuxPage.length) {
        if (this.myRecSerieAuxPage.length == 0) {
          return false;
        }
        const result = this.myRecSerieAuxPage[page - 1].map(
          async (value, index) => {
            const serieRaw = await this.serieService.getSerieComplete(
              value.contentId as number
            );
            const serie = new SerieCatalogo(undefined, undefined, serieRaw);
            return { serie, content: value };
          }
        );
        return {
          result: await Promise.all(result),
          totalPage: this.myRecSerieAuxPage.length,
        };
      } else {
        const newWave = await this.listService.getMyRecommendatation(
          type,
          this.myRecSerieAuxPage[this.myRecSerieAuxPage.length - 1][
            this.myRecSerieAuxPage[this.myRecSerieAuxPage.length - 1].length - 1
          ]
        );
        if (newWave == false) {
          return false;
        }
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.myRecSerieAuxPage.push(newWave.slice(i, i + 12));
        }
        const result = this.myRecSerieAuxPage[page - 1].map(
          async (value, index) => {
            const serieComplete = await this.serieService.getSerieComplete(
              value.contentId as number
            );
            const serie = new SerieCatalogo(
              undefined,
              undefined,
              serieComplete
            );
            return { serie, content: value };
          }
        );
        return {
          result: await Promise.all(result),
          totalPage: this.myRecSerieAuxPage.length,
        };
      }
    } else {
      if (!this.myRecBookAuxPage) {
        this.myRecBookAuxPage = [];
        const firstWave = await this.listService.getMyRecommendatation(type);
        if (firstWave == false) {
          return false;
        }
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.myRecBookAuxPage.push(firstWave.slice(i, i + 12));
        }
        const result = this.myRecBookAuxPage[page - 1].map(
          async (value, index) => {
            const bookComplete = await this.bookService.getBookComplete(
              value.contentId.toString()
            );
            const book = new BookCatalogo(undefined, undefined, bookComplete);
            return { book, content: value };
          }
        );
        return {
          result: await Promise.all(result),
          totalPage: this.myRecBookAuxPage.length,
        };
      }
      if (page <= this.myRecBookAuxPage.length) {
        if (this.myRecBookAuxPage.length == 0) {
          return false;
        }
        const result = this.myRecBookAuxPage[page - 1].map(
          async (value, index) => {
            const bookRaw = await this.bookService.getBookComplete(
              value.contentId.toString()
            );
            const book = new BookCatalogo(undefined, undefined, bookRaw);
            return { book, content: value };
          }
        );
        return {
          result: await Promise.all(result),
          totalPage: this.myRecBookAuxPage.length,
        };
      } else {
        const newWave = await this.listService.getMyRecommendatation(
          type as search,
          this.myRecBookAuxPage[this.myRecBookAuxPage.length - 1][11]
        );
        if (newWave == false) {
          return false;
        }
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.myRecBookAuxPage.push(newWave.slice(i, i + 12));
        }
        const result = this.myRecBookAuxPage[page - 1].map(
          async (value, index) => {
            const bookComplete = await this.bookService.getBookComplete(
              value.contentId.toString()
            );
            const book = new BookCatalogo(undefined, undefined, bookComplete);
            return { book, content: value };
          }
        );
        return {
          result: await Promise.all(result),
          totalPage: this.myRecBookAuxPage.length,
        };
      }
    }
  }
}
