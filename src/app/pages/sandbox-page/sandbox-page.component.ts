import { Component, OnInit } from '@angular/core';
import { bookCatalogo, CatalogoAnime, serieCatalogo } from 'src/app/data/interfaces';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { BookService } from 'src/app/services/book/book.service';
import { SerieService } from 'src/app/services/serie/serie.service';

@Component({
  selector: 'app-sandbox-page',
  templateUrl: './sandbox-page.component.html',
  styleUrls: ['./sandbox-page.component.scss']
})
export class SandboxPageComponent implements OnInit {

  animes: CatalogoAnime[] = []
  books: bookCatalogo[] = []
  series: serieCatalogo[] = []

  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService
  ) {
    //        SEARCH
    // animeService.search('the promise',false).then((data)=>{
    //   console.log("false --->", data)
    // })
    // animeService.search('the promisse',true).then((data)=>{
    //   console.log("true --->", data)
    // })
    // bookService.search('a passagem justin croni', false).then((data) => {
    //   console.log("false --->", data)
    // })
    // bookService.search('a passagem justin croni', true).then((data) => {
    //   console.log("true --->", data)
    // })
    // serieService.search('stranger things', false).then((data) => {
    //   console.log("false --->", data)
    // })
    // serieService.search('stranger things', true).then((data) => {
    //   console.log("true --->", data)
    // })

    //        HOME CATALOGO
    // animeService.getHomeCatalogo().then((animes)=>{
    //   this.animes = animes
    // })
    // bookService.getHomeCatalogo().then((books)=>{
    //   this.books = books
    // })
    // serieService.getHomeCatalogo().then((series) => {
    //   this.series = series
    // })
  }

  ngOnInit() {
  }

}
