import { Injectable } from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { ListService } from '../list/list.service';
import { SerieService } from '../serie/serie.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class FriendListPaginationService {
  friendAnimeAuxPage?: { content: content; result: AnimeCatalogo }[][];
  friendSerieAuxPage?: { content: content; result: SerieCatalogo }[][];
  friendBookAuxPage?: { content: content; result: BookCatalogo }[][];
  totalPage: number = 0
  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService,
    public listService: ListService,
    private userService: UserService
  ) { }
  async friendListPage(page: number, type: search, friendId: string) {
    const friendDoc = await this.userService.getUserFromIdApp(friendId)
    if (friendDoc == null) {
      throw "friend not finded"
    }
    const total = await this.listService.getTotalContent(friendDoc)
    if (type == 'ANIME') {
      if (this.friendAnimeAuxPage == undefined) {
        this.friendAnimeAuxPage = []
        this.totalPage = Math.ceil(total.anime / 12)
        const result = await this.listService.getFriendList(friendId, 'ANIME')
        this.friendAnimeAuxPage.push(result as {
          content: content;
          result: AnimeCatalogo
        }[])
        return {
          result: this.friendAnimeAuxPage[0].map((value) => {
            return { anime: value.result, content: value.content }
          }),
          totalPage: this.totalPage
        }
      }
      if (page > this.friendAnimeAuxPage.length) {
        const lastElement = this.friendAnimeAuxPage[this.friendAnimeAuxPage.length][11]
        const result = await this.listService.getFriendList(friendId, 'ANIME', lastElement.content)
        this.friendAnimeAuxPage.push(result as {
          content: content;
          result: AnimeCatalogo
        }[])
        return {
          result: this.friendAnimeAuxPage[page - 1].map((value) => {
            return { anime: value.result, content: value.content }
          }),
          totalPage: this.totalPage
        }
      }
      return {
        result: this.friendAnimeAuxPage[page - 1].map((value) => {
          return { anime: value.result, content: value.content }
        }),
        totalPage: this.totalPage
      }
    } else if (type == 'SERIE') {
      if (this.friendSerieAuxPage == undefined) {
        this.friendSerieAuxPage = []
        this.totalPage = Math.ceil(total.anime / 12)
        const result = await this.listService.getFriendList(friendId, 'SERIE')
        this.friendSerieAuxPage.push(result as {
          content: content;
          result: SerieCatalogo
        }[])
        return {
          result: this.friendSerieAuxPage[0].map((value) => {
            return { serie: value.result, content: value.content }
          }),
          totalPage: this.totalPage
        }
      }
      if (page > this.friendSerieAuxPage.length) {
        const lastElement = this.friendSerieAuxPage[this.friendSerieAuxPage.length][11]
        const result = await this.listService.getFriendList(friendId, 'SERIE', lastElement.content)
        this.friendSerieAuxPage.push(result as {
          content: content;
          result: SerieCatalogo
        }[])
        return {
          result: this.friendSerieAuxPage[page - 1].map((value) => {
            return { serie: value.result, content: value.content }
          }),
          totalPage: this.totalPage
        }
      }
      return {
        result: this.friendSerieAuxPage[page - 1].map((value) => {
          return { serie: value.result, content: value.content }
        }),
        totalPage: this.totalPage
      }
    } else {
      if (this.friendBookAuxPage == undefined) {
        this.friendBookAuxPage = []
        this.totalPage = Math.ceil(total.anime / 12)
        const result = await this.listService.getFriendList(friendId, 'BOOK')
        this.friendBookAuxPage.push(result as {
          content: content;
          result: BookCatalogo
        }[])
        return {
          result: this.friendBookAuxPage[0].map((value) => {
            return { book: value.result, content: value.content }
          }),
          totalPage: this.totalPage
        }
      }
      if (page > this.friendBookAuxPage.length) {
        const lastElement = this.friendBookAuxPage[this.friendBookAuxPage.length][11]
        const result = await this.listService.getFriendList(friendId, 'BOOK', lastElement.content)
        this.friendBookAuxPage.push(result as {
          content: content;
          result: BookCatalogo
        }[])
        return {
          result: this.friendBookAuxPage[page - 1].map((value) => {
            return { book: value.result, content: value.content }
          }),
          totalPage: this.totalPage
        }
      }
      return {
        result: this.friendBookAuxPage[page - 1].map((value) => {
          return { book: value.result, content: value.content }
        }),
        totalPage: this.totalPage
      }
    }
  }
}
