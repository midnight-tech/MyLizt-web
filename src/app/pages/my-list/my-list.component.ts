import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: [
    '../../sass/components/_page-card-list.scss',
    './my-list.component.scss',
  ],
})
export class MyListComponent implements OnInit {
  anime: { anime: AnimeCatalogo; content: content }[] = [];
  serie: { serie: SerieCatalogo; content: content }[] = [];
  book: { book: BookCatalogo; content: content }[] = [];

  loadingArray = new Array(12).fill(0);

  type!: search;

  constructor(actRoute: ActivatedRoute, public loadingService: LoadingService) {
    actRoute.params.subscribe((value) => {
      this.type = value.type.toUpperCase();
    });
  }

  ngOnInit() {}
}
