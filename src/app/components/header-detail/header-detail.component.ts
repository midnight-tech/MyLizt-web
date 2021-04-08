import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import {
  CompleteAnime,
  CompleteBook,
  CompleteSerie,
  search,
} from 'src/app/data/interfaces';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-header-detail',
  templateUrl: './header-detail.component.html',
  styleUrls: ['./header-detail.component.scss'],
})
export class HeaderDetailComponent implements OnInit {
  @Input() anime!: CompleteAnime;
  @Input() serie!: CompleteSerie;
  @Input() book!: CompleteBook;
  @Input() type!: search;
  @Input() watched!: boolean;

  seasonAtual = 0;

  @Output() seasonAtualEmitter = new EventEmitter<number>();
  onMyList: boolean = false;
  updateState = false;

  constructor(private listService: ListService) {
    this.seasonAtualEmitter.subscribe((value) => {
      this.seasonAtual = value;
    });
  }

  ngOnInit() {
    this.isItInMyList();
    if (this.type == 'SERIE') {
      this.seasonAtualEmitter.emit(0);
      return;
    }
  }

  changeSeason(season: number) {
    console.log('Me clickou');
    if (season >= 0 && season <= this.serie.number_of_seasons) {
      this.seasonAtualEmitter.emit(season);
    }
  }

  isItInMyList() {
    if (this.type == 'ANIME') {
      this.listService
        .contentInMyList(this.anime.mal_id, 'ANIME')
        .then((value) => {
          this.onMyList = value;
        });
    } else if (this.type == 'SERIE') {
      this.listService.contentInMyList(this.serie.id, 'SERIE').then((value) => {
        this.onMyList = value;
      });
    } else {
      this.listService.contentInMyList(this.book.id, 'BOOK').then((value) => {
        this.onMyList = value;
      });
    }
  }

  addToMyList() {
    if (this.type == 'ANIME') {
      this.listService.addContent(this.anime.mal_id, 'ANIME').then(() => {
        this.isItInMyList();
      });
    } else if (this.type == 'SERIE') {
      this.listService.addContent(this.serie.id, 'SERIE').then(() => {
        this.isItInMyList();
      });
    } else {
      this.listService.addContent(this.book.id, 'BOOK').then(() => {
        this.isItInMyList();
      });
    }
  }
}
