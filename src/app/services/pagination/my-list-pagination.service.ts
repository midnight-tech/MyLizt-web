import { Injectable } from '@angular/core';
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
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
export class MyListPaginationService {
  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService,
    public listService: ListService
  ) {}

  animeAuxPage?: QueryDocumentSnapshot<DocumentData>[][] = [];
  serieAuxPage?: { serie: SerieCatalogo; content: content }[][];
  bookAuxPage?: { book: BookCatalogo; content: content }[][];
  async myListPage(page: number, type: search) {
    if (type == 'ANIME') {
      if (!this.animeAuxPage) {
        this.animeAuxPage = [];
        // const firstWave = await this.listService.getAnimeContent()
        const animeQuery = await this.listService.getAnimeContent();

        for (let i = 0, j = animeQuery.docs.length; i < j; i += 12) {
          this.animeAuxPage.push(animeQuery.docs.slice(i, i + 12));
        }
        const result = this.animeAuxPage[page - 1].map(async (value, index) => {
          const content = value.data() as content;
          const animeRaw = await this.animeService.getAnimeComplete(
            content.contentId as number,
            index
          );
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw);
          return { anime, content };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.animeAuxPage.length
        };
      }
      if (page <= this.animeAuxPage.length) {
        const result = this.animeAuxPage[page - 1].map(async (value, index) => {
          const content = value.data() as content;
          const animeRaw = await this.animeService.getAnimeComplete(
            content.contentId as number,
            index
          );
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw);
          return { anime, content };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.animeAuxPage.length
        };
      } else {
        const animeQuery = await this.listService.getAnimeContent();
        for (let i = 0, j = animeQuery.docs.length; i < j; i += 12) {
          this.animeAuxPage.push(animeQuery.docs.slice(i, i + 12));
        }
        const result = this.animeAuxPage[page - 1].map(async (value, index) => {
          const content = value.data() as content;
          const animeRaw = await this.animeService.getAnimeComplete(
            content.contentId as number,
            index
          );
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw);
          return { anime, content };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.animeAuxPage.length
        };
      }
    } else if (type == 'SERIE') {
      if (!this.serieAuxPage) {
        this.serieAuxPage = [];
        const firstWave = await this.listService.getAllSerieContent();
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.serieAuxPage.push(firstWave.slice(i, i + 12));
        }
        return {
          result : this.serieAuxPage[page - 1],
          totalPage : this.serieAuxPage.length
        };
      }
      if (page <= this.serieAuxPage.length) {
        return {
          result : this.serieAuxPage[page - 1],
          totalPage : this.serieAuxPage.length
        };
      } else {
        const newWave = await this.listService.getAllSerieContent(
          this.serieAuxPage[this.serieAuxPage.length - 1][11]
        );
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.serieAuxPage.push(newWave.slice(i, i + 12));
        }
        return {
          result : this.serieAuxPage[page - 1],
          totalPage : this.serieAuxPage.length
        };
      }
    } else {
      if (!this.bookAuxPage) {
        this.bookAuxPage = [];
        const firstWave = await this.listService.getAllBookContent();
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.bookAuxPage.push(firstWave.slice(i, i + 12));
        }
        return {
          result : this.bookAuxPage[page - 1],
          totalPage : this.bookAuxPage.length
        };
      }
      if (page <= this.bookAuxPage.length) {
        return {
          result : this.bookAuxPage[page - 1],
          totalPage : this.bookAuxPage.length
        };
      } else {
        const newWave = await this.listService.getAllBookContent(
          this.bookAuxPage[this.bookAuxPage.length - 1][11]
        );
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.bookAuxPage.push(newWave.slice(i, i + 12));
        }
        return {
          result : this.bookAuxPage[page - 1],
          totalPage : this.bookAuxPage.length
        };
      }
    }
  }
}
