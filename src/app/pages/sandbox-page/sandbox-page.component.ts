import { Component, OnInit } from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { CatalogoAnimeInterface, SerieCatalogoInterface } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { BookService } from 'src/app/services/book/book.service';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { ListService } from 'src/app/services/list/list.service';
import { SerieService } from 'src/app/services/serie/serie.service';

@Component({
  selector: 'app-sandbox-page',
  templateUrl: './sandbox-page.component.html',
  styleUrls: ['./sandbox-page.component.scss']
})
export class SandboxPageComponent implements OnInit {

  animes: AnimeCatalogo[] = []
  books: BookCatalogo[] = []
  series: SerieCatalogo[] = []

  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService,
    public listService : ListService
  ) {
     listService.getMyList()
  }

  ngOnInit() {
  }

}
