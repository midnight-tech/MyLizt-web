import { Component, OnInit } from '@angular/core';
import { type } from 'node:os';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { CatalogoAnimeInterface, SerieCatalogoInterface } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { BookService } from 'src/app/services/book/book.service';
import { HomeContextService } from 'src/app/services/home-context/home.service';
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
    // animeService.getAnimeComplete(1).then((value)=>{
    //   console.log(value)
    // })
    // bookService.getBookComplete("gzYQCwAAQBAJ").then((value)=>{
    //   console.log(value)
    // })
    serieService.partialSearch("the",true).then((value)=>{
      console.log(value[0],typeof value[0])
    })

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
