import { Component, Input, OnInit } from '@angular/core';
import {
  CompleteAnime,
  CompleteBook,
  CompleteSerie,
  search,
} from 'src/app/data/interfaces';

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

  constructor() {}

  ngOnInit() {}

  public get content() {
    if (this.type == 'ANIME') return this.anime;
    else if (this.type == 'SERIE') return this.serie;
    else return this.book;
  }
}
