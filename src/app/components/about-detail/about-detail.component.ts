import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CompleteAnime,
  CompleteBook,
  CompleteSerie,
  search,
} from 'src/app/data/interfaces';

interface JikanLinkInterface {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

@Component({
  selector: 'app-about-detail',
  templateUrl: './about-detail.component.html',
  styleUrls: ['./about-detail.component.scss'],
})
export class AboutDetailComponent implements OnInit {
  @Input() anime!: CompleteAnime;
  @Input() serie!: CompleteSerie;
  @Input() book!: CompleteBook;
  @Input() type!: search;
  @Input() season!: number

  constructor(private router: Router) { }

  navigateTopage(info: JikanLinkInterface) {
    if (info.type == 'anime') {
      this.router.navigate(['home', 'detail', 'anime', info.mal_id.toString(),])
    }
  }

  ngOnInit() {
  }
}
