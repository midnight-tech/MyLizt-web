import { Injectable } from '@angular/core';
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { BookService } from '../book/book.service';
import { ListService } from '../list/list.service';
import { SerieService } from '../serie/serie.service';

const TOTAL_CONTENT_ON_PAGE = 12;
const LAST_INDEX_OF_PAGE = 11;

@Injectable({
  providedIn: 'root',
})
export class MyListPaginationService {
  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService,
    public listService: ListService,
    private authService: AuthenticationService
  ) { }

  animeAuxPage?: { anime: AnimeCatalogo; content: content }[][];
  serieAuxPage?: { serie: SerieCatalogo; content: content }[][];
  bookAuxPage?: { book: BookCatalogo; content: content }[][];
  totalPage: number = 0;

  clean() {
    this.animeAuxPage = undefined;
    this.serieAuxPage = undefined;
    this.bookAuxPage = undefined;
  }

  async myListPage(page: number, type: search) {
    if (type == 'ANIME') {
      return await this.getAnime(page);
    } else if (type == 'SERIE') {
      return await this.getSerie(page);
    } else {
      return await this.getBook(page);
    }
  }


  async getAnime(page: number) {
    if (!this.animeAuxPage) {
      this.animeAuxPage = []
      const pageCount = await this.listService.getTotalContent(this.authService.userFirestore!)
      this.totalPage = Math.ceil(pageCount.anime / TOTAL_CONTENT_ON_PAGE)
      const query = await this.listService.getAnimeContent()
      this.animeAuxPage.push(query)
      return { result: this.animeAuxPage[0], totalPage: this.totalPage }
    }
    if (page > this.animeAuxPage.length) {
      const lastElement = this.animeAuxPage[this.animeAuxPage.length - 1][LAST_INDEX_OF_PAGE]
      const response = await this.listService.getAnimeContent(lastElement.content)
      this.animeAuxPage.push(response)
      return { result: this.animeAuxPage[page - 1], totalPage: this.totalPage }
    }
    return { result: this.animeAuxPage[page - 1], totalPage: this.totalPage }
  }

  async getSerie(page: number) {
    if (!this.serieAuxPage) {
      this.serieAuxPage = []
      const pageCount = await this.listService.getTotalContent(this.authService.userFirestore!)
      this.totalPage = Math.ceil(pageCount.serie / TOTAL_CONTENT_ON_PAGE)
      const query = await this.listService.getAllSerieContent()
      this.serieAuxPage.push(query)
      return { result: this.serieAuxPage[0], totalPage: this.totalPage }
    }
    if (page > this.serieAuxPage.length) {
      const lastElement = this.serieAuxPage[this.serieAuxPage.length - 1][LAST_INDEX_OF_PAGE]
      const response = await this.listService.getAllSerieContent(lastElement.content)
      this.serieAuxPage.push(response)
      return { result: this.serieAuxPage[page - 1], totalPage: this.totalPage }
    }
    let firstElementOfPage = this.serieAuxPage[page - 1][0].content
    const response = await this.listService.getAllSerieContent(firstElementOfPage)
    this.serieAuxPage[page - 1] = response
    return { result: this.serieAuxPage[page - 1], totalPage: this.totalPage }
  }

  async getBook(page: number) {
    if (!this.bookAuxPage) {
      this.bookAuxPage = []
      const pageCount = await this.listService.getTotalContent(this.authService.userFirestore!)
      this.totalPage = Math.ceil(pageCount.book / TOTAL_CONTENT_ON_PAGE)
      const query = await this.listService.getAllBookContent()
      this.bookAuxPage.push(query)
      return { result: this.bookAuxPage[0], totalPage: this.totalPage }
    }
    if (page > this.bookAuxPage.length) {
      const lastElement = this.bookAuxPage[this.bookAuxPage.length - 1][LAST_INDEX_OF_PAGE]
      const response = await this.listService.getAllBookContent(lastElement.content)
      this.bookAuxPage.push(response)
      return { result: this.bookAuxPage[page - 1], totalPage: this.totalPage }
    }
    return { result: this.bookAuxPage[page - 1], totalPage: this.totalPage }
  }
}