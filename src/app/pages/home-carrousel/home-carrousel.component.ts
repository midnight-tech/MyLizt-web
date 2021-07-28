import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { BookService } from 'src/app/services/book/book.service';
import { SerieService } from 'src/app/services/serie/serie.service';
import { CarrousselEntry } from 'src/app/data/interfaces'

@Component({
  selector: 'app-home-carrousel',
  templateUrl: './home-carrousel.component.html',
  styleUrls: ['./home-carrousel.component.scss']
})
export class HomeCarrouselComponent implements OnInit {

  anime: CarrousselEntry[] = []
  serie: CarrousselEntry[] = []
  book: CarrousselEntry[] = []
  animeLoaded: boolean = false
  serieLoaded: boolean = false
  bookLoaded: boolean = false


  constructor(
    private router: Router,
    private animeService: AnimeService,
    private serieService: SerieService,
    private bookService: BookService
  ) {
    this.animeService.getHomeCarroussel().then((value) => {
      value.map((anime) => {
        const title = anime.title
        const img = anime.image_url
        const id = anime.mal_id.toString()
        this.anime.push({
          title,
          img,
          id
        })
      })
      this.animeLoaded = true
    })
    this.serieService.getCarroussel().then((value) => {
      value.map((serie) => {
        const title = serie.name
        const img = serie.poster_path || serie.backdrop_path
        const id = serie.id.toString()
        this.serie.push({
          title,
          img,
          id
        })
      })
      this.serieLoaded = true
    })
    this.bookService.getHomeCarroussel().then((value) => {
      value.map((book) => {
        const title = book.volumeInfo.title
        const img = book.volumeInfo.image
        const id = book.id
        this.book.push({
          title,
          img,
          id
        })
      })
      this.bookLoaded = true
    })
  }

  ngOnInit() {
  }

  navigateToCatalogo(type: string) {
    this.router.navigate(['home', 'catalogo', type])
  }

}
