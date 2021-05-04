import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  CompleteAnime,
  CompleteBook,
  CompleteSerie,
  content,
} from 'src/app/data/interfaces';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { BookService } from 'src/app/services/book/book.service';
import { ListService } from 'src/app/services/list/list.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { SerieService } from 'src/app/services/serie/serie.service';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],
})
export class MenuLeftComponent implements OnInit {
  @Output() menuLeftEvent = new EventEmitter<boolean>();

  anime: { anime: CompleteAnime; content: content }[] = [];
  serie: { serie: CompleteSerie; content: content }[] = [];
  book: { book: CompleteBook; content: content }[] = [];

  constructor(
    private listService: ListService,
    private animeService: AnimeService,
    private bookService: BookService,
    private serieService: SerieService,
    private router: Router,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.getContents();
  }

  getContents() {
    this.listService.getHomeContent().then(({ anime, book, serie }) => {
      let result = 0;
      if (anime == undefined) {
        throw 'content anime undefined';
      }
      anime!.map(async (value, index) => {
        let animeMap = await this.animeService.getAnimeComplete(
          value.contentId as number,
          index
        );
        this.anime.push({ anime: animeMap, content: value });
      });

      for (let i of book!!) {
        this.bookService
          .getBookComplete(i.contentId as string)
          .then((value) => {
            this.book.push({ book: value, content: i });
          });
      }
      for (let i of serie!!) {
        this.serieService
          .getSerieComplete(i.contentId as number)
          .then((value) => {
            this.serie.push({ serie: value, content: i });
          });
      }
    });
  }

  reloadPage() {
    location.reload();
  }

  navigateToDetail(id: string, type: string) {
    this.menuLeftEvent.emit(false);
    this.router.navigate(['home', 'detail', type, id]);
  }

  navigateToMyList(type: string) {
    this.menuLeftEvent.emit(false);
    if (this.loading.isLoading) {
      return;
    }
    this.router.navigate(['home', 'my-list', type]);
  }

  navigateToMyRecommendation(type: string) {
    this.menuLeftEvent.emit(false);
    if (this.loading.isLoading) {
      return;
    }
    this.router.navigate(['home', 'recommendations', type]);
  }

  closeMenu() {
    this.menuLeftEvent.emit(false);
  }
}
