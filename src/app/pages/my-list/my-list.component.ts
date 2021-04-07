import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { CatalogoAnimeInterface, content, contentAnime, contentBook, contentSerie } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss']
})
export class MyListComponent implements OnInit {

  type: string = ""
  anime: AnimeCatalogo[] = []
  serie: SerieCatalogo[] = []
  book: BookCatalogo[] = []

  constructor(
    actRoute: ActivatedRoute,
    private listService: ListService,
    public homeContext: HomeContextService,
  ) {
    actRoute.params.subscribe((value) => {
      this.type = value.type
      this.cleanContent()
      if (value.type == 'anime') {
        this.getAnimes()
      } else if (value.type == 'serie') {
        this.getSeries()
      } else {
        this.getBooks()
      }
    })
  }

  ngOnInit() {
  }

  cleanContent() {
    this.anime = []
    this.serie = []
    this.book = []
  }

  getAnimes() {
    this.listService.getAnimeContent(1).then((value) => {
      value.map((value) => {
        this.anime.push(value.anime)
      })
    })
  }

  getSeries() {
    this.listService.getAllSerieContent().then((value) => {
      value.map((value) => {
        this.serie.push(value.serie)
      })
    })
  }

  getBooks(){
    this.listService.getAllBookContent().then((value) => {
      value.map((value) => {
        this.book.push(value.book)
      })
    })
  }
}
