import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
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
import firebase from 'firebase'

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],
})
export class MenuLeftComponent implements OnInit, OnDestroy {
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
    private loading: LoadingService,
    private nZone: NgZone
  ) { }

  ngOnDestroy(): void {
    for (let unsub of this.listService.unsubListenerMenuLeft) {
      unsub()
    }
  }

  ngOnInit() {
    this.listService.unsubListenerMenuLeft = []
    this.getContents();
  }

  getContents() {
    this.listService.getHomeContent((snapshot: firebase.firestore.QuerySnapshot<content>, type: string) => {
      this.nZone.run(() => {
        if (type == 'anime') this.anime = []
        if (type == 'serie') this.serie = []
        if (type == 'book') this.book = []
        snapshot.docs.map(async (value) => {
          const content = value.data()
          switch (content.contentType) {
            case 'ANIME':
              this.anime.push({ content: content, anime: await this.animeService.getAnimeComplete(content.contentId as number) })
              break
            case 'BOOK':
              this.book.push({ content: content, book: await this.bookService.getBookComplete(content.contentId as string) })
              break
            case 'SERIE':
              this.serie.push({ content: content, serie: await this.serieService.getSerieComplete(content.contentId as number) })
              break
          }
        })
      })
    })
  }

  reloadPage() {
    location.reload();
  }

  navigateToDetail(id: string, type: string) {
    this.menuLeftEvent.emit(false);
    this.router.navigate(['home', 'detail', type, id], { replaceUrl: true });
  }

  navigateToMyList(type: string) {
    this.menuLeftEvent.emit(false);
    if (this.loading.isLoading) {
      return;
    }
    this.router.navigate(['home', 'my-list', type], { replaceUrl: true });
  }

  navigateToMyRecommendation(type: string) {
    this.menuLeftEvent.emit(false);
    if (this.loading.isLoading) {
      return;
    }
    this.router.navigate(['home', 'recommendations', type], {
      replaceUrl: true,
    });
  }

  closeMenu() {
    this.menuLeftEvent.emit(false);
  }
}
