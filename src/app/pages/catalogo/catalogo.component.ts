import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {
  type!: search;
  anime: AnimeCatalogo[] = []
  serie: SerieCatalogo[] = []
  book: BookCatalogo[] = []

  constructor(
    public homeContext: HomeContextService,
    public actRoute: ActivatedRoute
  ) {
    this.actRoute.params.subscribe((value) => {
      const { type } = value;
      this.type = value.type.toUpperCase() as search;
    });
  }

  ngOnInit() { }
}
