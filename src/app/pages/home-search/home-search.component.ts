import { Component, OnInit } from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss'],
})
export class HomeSearchComponent implements OnInit {
  anime: AnimeCatalogo[] = [];
  serie: SerieCatalogo[] = [];
  book: BookCatalogo[] = [];

  constructor(public homeContext: HomeContextService) { }

  ngOnInit() { }
}
