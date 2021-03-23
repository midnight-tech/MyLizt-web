import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { type } from 'node:os';
import { bookCatalogo, CatalogoAnime, serieCatalogo } from 'src/app/data/interfaces';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { BookService } from 'src/app/services/book/book.service';
import { SerieService } from 'src/app/services/serie/serie.service';

type search = 'ALL' | 'ANIME' | 'SERIE' | 'BOOK'


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  animes: CatalogoAnime[] = []
  series: serieCatalogo[] = []
  books: bookCatalogo[] = []

  searchField = new FormControl("", { updateOn: 'change'})

  searchOptions: search[] = [
    'ALL',
    'ANIME',
    'SERIE',
    'BOOK'
  ]

  result: CatalogoAnime[] | bookCatalogo[] | serieCatalogo[] = []

  searchIndex = 0

  isActive = false
  isActiveSearch = false;

  constructor(
    public animeService: AnimeService,
    public serieService: SerieService,
    public bookService: BookService
  ) {
    this.searchField.valueChanges.subscribe(() => {
      console.log(this.searchField.value.length)
      if (this.searchField.value.length < 3) {
        this.isActiveSearch = false
        return
      }
      setTimeout(()=>{
        if (this.searchField.value.length < 3) { return }
        this.isActiveSearch = true;
        // this.search(this.searchOptions[this.searchIndex])
      },1000)
    })
  }

  ngOnInit() {
    this.searchField.enable({emitEvent: true})
  }

  setSearchIndex(index: number) {
    this.searchIndex = index
    this.isActive = false;
  }

  dropdown() {
    this.isActive = !this.isActive
  }

  closeSearchModal() {
    this.isActiveSearch = false
  }

  search(searchtype: search) {
    switch (searchtype) {
      case 'ALL':
        this.animeService.search(this.searchField.value).then((value) => {
          this.animes = value
        })
        this.bookService.search(this.searchField.value).then((value) => {
          this.books = value
        })
        this.serieService.search(this.searchField.value).then((value) => {
          this.series = value
        })
        break
      case 'ANIME':
        this.books = []
        this.series = []
        this.animeService.search(this.searchField.value, true).then((value) => {
          this.animes = value
        })
        break
      case 'BOOK':
        this.animes = []
        this.series = []
        this.bookService.search(this.searchField.value, true).then((value) => {
          this.books = value
        })
        break
      case 'SERIE':
        this.animes = []
        this.books = []
        this.serieService.search(this.searchField.value, true).then((value) => {
          this.series = value
        })
        break
    }
  }


}
