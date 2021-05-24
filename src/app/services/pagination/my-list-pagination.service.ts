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
      if (!this.animeAuxPage) {
        this.animeAuxPage = []
        const pageCount = await this.listService.getTotalContent(this.authService.userFirestore!)
        this.totalPage = Math.ceil(pageCount.anime / 12)
        const query = await this.listService.getAnimeContent()
        this.animeAuxPage.push(query)
        return { result: this.animeAuxPage[0], totalPage: this.totalPage }
      }
      if (page > this.animeAuxPage.length) {
        const lastElement = this.animeAuxPage[this.animeAuxPage.length - 1][11]
        const response = await this.listService.getAnimeContent(lastElement.content)
        this.animeAuxPage.push(response)
        return { result: this.animeAuxPage[page - 1], totalPage: this.totalPage }
      }
      return { result: this.animeAuxPage[page - 1], totalPage: this.totalPage }
    } else if (type == 'SERIE') {
      if (!this.serieAuxPage) {
        this.serieAuxPage = []
        const pageCount = await this.listService.getTotalContent(this.authService.userFirestore!)
        this.totalPage = Math.ceil(pageCount.serie / 12)
        const query = await this.listService.getAllSerieContent()
        this.serieAuxPage.push(query)
        return { result: this.serieAuxPage[0], totalPage: this.totalPage }
      }
      if (page > this.serieAuxPage.length) {
        const lastElement = this.serieAuxPage[this.serieAuxPage.length - 1][11]
        const response = await this.listService.getAllSerieContent(lastElement.content)
        this.serieAuxPage.push(response)
        return { result: this.serieAuxPage[page - 1], totalPage: this.totalPage }
      }
      return { result: this.serieAuxPage[page - 1], totalPage: this.totalPage }
    } else {
      if (!this.bookAuxPage) {
        this.bookAuxPage = []
        const pageCount = await this.listService.getTotalContent(this.authService.userFirestore!)
        this.totalPage = Math.ceil(pageCount.book / 12)
        const query = await this.listService.getAllBookContent()
        this.bookAuxPage.push(query)
        return { result: this.bookAuxPage[0], totalPage: this.totalPage }
      }
      if (page > this.bookAuxPage.length) {
        const lastElement = this.bookAuxPage[this.bookAuxPage.length - 1][11]
        const response = await this.listService.getAllBookContent(lastElement.content)
        this.bookAuxPage.push(response)
        return { result: this.bookAuxPage[page - 1], totalPage: this.totalPage }
      }
      return { result: this.bookAuxPage[page - 1], totalPage: this.totalPage }
    }
  }
}
