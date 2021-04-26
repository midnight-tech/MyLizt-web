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
export class FriendListPaginationService {
  friendAnimeAuxPage?: content[][];
  friendSerieAuxPage?: content[][];
  friendBookAuxPage?: content[][];

  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService,
    public listService: ListService,
  ) {}
  async friendListPage(page: number, type: search, friendId: string) {
    if (type == 'ANIME') {
      if (!this.friendAnimeAuxPage) {
        this.friendAnimeAuxPage = [];
        const animeContent = await this.listService.getFriendList(
          friendId,
          type
        );
        if (animeContent == false) {
          return false;
        }
        for (let i = 0, j = animeContent.length; i < j; i += 12) {
          this.friendAnimeAuxPage.push(animeContent.slice(i, i + 12));
        }
        const result = this.friendAnimeAuxPage[page - 1].map(async (value, index) => {
          const animeRaw = await this.animeService.getAnimeComplete(
            value.contentId as number,
            index
          );
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw);
          return { anime, content: value };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.friendAnimeAuxPage.length
        };
      }
      if (page <= this.friendAnimeAuxPage.length) {
        const result = this.friendAnimeAuxPage[page - 1].map(async (value, index) => {
          const animeRaw = await this.animeService.getAnimeComplete(
            value.contentId as number,
            index
          );
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw);
          return { anime, content: value };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.friendAnimeAuxPage.length
        };
      } else {
        const animeQuery = await this.listService.getFriendList(
          friendId,
          type,
          this.friendAnimeAuxPage[this.friendAnimeAuxPage.length - 1][11]
        );
        if (animeQuery == false) {
          return false;
        }
        for (let i = 0, j = animeQuery.length; i < j; i += 12) {
          this.friendAnimeAuxPage.push(animeQuery.slice(i, i + 12));
        }
        const result = this.friendAnimeAuxPage[page - 1].map(async (value, index) => {
          const animeRaw = await this.animeService.getAnimeComplete(
            value.contentId as number,
            index
          );
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw);
         return { anime, content: value };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.friendAnimeAuxPage.length
        };
      }
    } else if (type == 'SERIE') {
      if (!this.friendSerieAuxPage) {
        this.friendSerieAuxPage = [];
        const firstWave = await this.listService.getFriendList(
          friendId,
          type
        );
        if (firstWave == false) {
          return false;
        }
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.friendSerieAuxPage.push(firstWave.slice(i, i + 12));
        }
        const result = this.friendSerieAuxPage[page - 1].map(async (value, index) => {
          const serieComplete = await this.serieService.getSerieComplete(
            value.contentId as number
          );
          const serie = new SerieCatalogo(undefined, undefined, serieComplete);
          return { serie, content: value };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.friendSerieAuxPage.length
        };
      }
      if (page <= this.friendSerieAuxPage.length) {
        const result = this.friendSerieAuxPage[page - 1].map(async (value, index) => {
          const serieRaw = await this.serieService.getSerieComplete(
            value.contentId as number
          );
          const serie = new SerieCatalogo(undefined, undefined, serieRaw);
          return { serie, content: value };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.friendSerieAuxPage.length
        };
      } else {
        const newWave = await this.listService.getFriendList(
          friendId,
          type,
          this.friendSerieAuxPage[this.friendSerieAuxPage.length - 1][
            this.friendSerieAuxPage[this.friendSerieAuxPage.length - 1].length -
              1
          ]
        );
        if (newWave == false) {
          return false;
        }
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.friendSerieAuxPage.push(newWave.slice(i, i + 12));
        }
        const result = this.friendSerieAuxPage[page - 1].map(async (value, index) => {
          const serieComplete = await this.serieService.getSerieComplete(
            value.contentId as number
          );
          const serie = new SerieCatalogo(undefined, undefined, serieComplete);
          return { serie, content: value };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.friendSerieAuxPage.length
        };
      }
    } else {
      if (!this.friendBookAuxPage) {
        this.friendBookAuxPage = [];
        const firstWave = await this.listService.getFriendList(
          friendId,
          type
        );
        if (firstWave == false) {
          return false;
        }
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.friendBookAuxPage.push(firstWave.slice(i, i + 12));
        }
        const result = this.friendBookAuxPage[page - 1].map(async (value, index) => {
          const bookComplete = await this.bookService.getBookComplete(
            value.contentId.toString()
          );
          const book = new BookCatalogo(undefined, undefined, bookComplete);
          return { book, content: value };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.friendBookAuxPage.length
        };
      }
      if (page <= this.friendBookAuxPage.length) {
        const result = this.friendBookAuxPage[page - 1].map(async (value, index) => {
          const bookRaw = await this.bookService.getBookComplete(
            value.contentId.toString()
          );
          const book = new BookCatalogo(undefined, undefined, bookRaw);
          return { book, content: value };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.friendBookAuxPage.length
        };
      } else {
        const newWave = await this.listService.getFriendList(
          friendId,
          type ,
          this.friendBookAuxPage[this.friendBookAuxPage.length - 1][11]
        );
        if (newWave == false) {
          return false;
        }
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.friendBookAuxPage.push(newWave.slice(i, i + 12));
        }
        const result = this.friendBookAuxPage[page - 1].map(async (value, index) => {
          const bookComplete = await this.bookService.getBookComplete(
            value.contentId.toString()
          );
          const book = new BookCatalogo(undefined, undefined, bookComplete);
          return { book, content: value };
        });
        return {
          result : await Promise.all(result),
          totalPage : this.friendBookAuxPage.length
        };
      }
    }
  }
}
