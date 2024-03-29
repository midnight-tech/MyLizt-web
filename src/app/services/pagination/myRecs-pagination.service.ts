import { Injectable } from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { CompleteAnime, CompleteBook, CompleteSerie, content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { AuthenticationService } from '../authentication/authentication.service';
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
    public listService: ListService,
    private authService: AuthenticationService
  ) { }

  myRecAnimeAuxPage?: { content: content; result: AnimeCatalogo }[][]
  myRecSerieAuxPage?: { content: content; result: SerieCatalogo }[][]
  myRecBookAuxPage?: { content: content; result: BookCatalogo }[][];
  totalPage: number = 0

  clean() {
    this.myRecAnimeAuxPage = undefined;
    this.myRecSerieAuxPage = undefined;
    this.myRecBookAuxPage = undefined;
  }

  async MyRecListPage(page: number, type: search) {
    const total = await this.listService.getTotalContentRec(this.authService.userFirestore!)
    if (type == 'ANIME') {
      return await this.getRecAnime(page)
    } else if (type == 'SERIE') {
      return await this.getRecSerie(page)
    } else {
      return await this.getRecBook(page)
    }
  }


  async getRecAnime(page: number) {
    const totalOfAnimes = await this.listService.getTotalContentRec(this.authService.userFirestore!)
    if (this.myRecAnimeAuxPage == undefined) {
      this.myRecAnimeAuxPage = []
      this.totalPage = Math.ceil(totalOfAnimes.anime / 12)
      const result = await this.listService.getMyRecommendatation('ANIME')
      this.myRecAnimeAuxPage.push(result as {
        content: content;
        result: AnimeCatalogo
      }[])
      return {
        result: this.myRecAnimeAuxPage[0].map((value) => {
          return { anime: value.result, content: value.content }
        }),
        totalPage: this.totalPage
      }
    }
    if (page > this.myRecAnimeAuxPage.length) {
      const lastElement = this.myRecAnimeAuxPage[this.myRecAnimeAuxPage.length - 1][11]
      const result = await this.listService.getMyRecommendatation('ANIME', lastElement.content)
      this.myRecAnimeAuxPage.push(result as {
        content: content;
        result: AnimeCatalogo
      }[])
      return {
        result: this.myRecAnimeAuxPage[page - 1].map((value) => {
          return { anime: value.result, content: value.content }
        }),
        totalPage: this.totalPage
      }
    }
    return {
      result: this.myRecAnimeAuxPage[page - 1].map((value) => {
        return { anime: value.result, content: value.content }
      }),
      totalPage: this.totalPage
    }
  }

  async getRecSerie(page: number) {
    const totalOfSeries = await this.listService.getTotalContentRec(this.authService.userFirestore!)
    this.totalPage = Math.ceil(totalOfSeries.serie / 12)

    if (this.myRecSerieAuxPage == undefined) {
      this.myRecSerieAuxPage = []
      const result = await this.listService.getMyRecommendatation('SERIE')
      this.myRecSerieAuxPage.push(result as {
        content: content;
        result: SerieCatalogo
      }[])
      return {
        result: this.myRecSerieAuxPage[0].map((value) => {
          return { serie: value.result, content: value.content }
        }),
        totalPage: this.totalPage
      }
    }
    if (page > this.myRecSerieAuxPage.length) {
      const lastElement = this.myRecSerieAuxPage[this.myRecSerieAuxPage.length - 1][11]
      const result = await this.listService.getMyRecommendatation('SERIE', lastElement.content)
      this.myRecSerieAuxPage.push(result as {
        content: content;
        result: SerieCatalogo
      }[])
      return {
        result: this.myRecSerieAuxPage[page - 1].map((value) => {
          return { serie: value.result, content: value.content }
        }),
        totalPage: this.totalPage
      }
    }
    return {
      result: this.myRecSerieAuxPage[page - 1].map((value) => {
        return { serie: value.result, content: value.content }
      }),
      totalPage: this.totalPage
    }
  }

  async getRecBook(page: number) {
    const totalDeBook = await this.listService.getTotalContentRec(this.authService.userFirestore!)
    if (this.myRecBookAuxPage == undefined) {
      this.myRecBookAuxPage = []
      this.totalPage = Math.ceil(totalDeBook.book / 12)
      const result = await this.listService.getMyRecommendatation('BOOK')
      this.myRecBookAuxPage.push(result as {
        content: content;
        result: BookCatalogo
      }[])
      return {
        result: this.myRecBookAuxPage[0].map((value) => {
          return { book: value.result, content: value.content }
        }),
        totalPage: this.totalPage
      }
    }
    if (page > this.myRecBookAuxPage.length) {
      const lastElement = this.myRecBookAuxPage[this.myRecBookAuxPage.length - 1][11]
      const result = await this.listService.getMyRecommendatation('BOOK', lastElement.content)
      this.myRecBookAuxPage.push(result as {
        content: content;
        result: BookCatalogo
      }[])
      return {
        result: this.myRecBookAuxPage[page - 1].map((value) => {
          return { book: value.result, content: value.content }
        }),
        totalPage: this.totalPage
      }
    }
    return {
      result: this.myRecBookAuxPage[page - 1].map((value) => {
        return { book: value.result, content: value.content }
      }),
      totalPage: this.totalPage
    }
  }
}
