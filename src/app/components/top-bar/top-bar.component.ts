import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { type } from 'node:os';
import { bookCatalogo, CatalogoAnime, search, serieCatalogo } from 'src/app/data/interfaces';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { BookService } from 'src/app/services/book/book.service';
import { HomeService } from 'src/app/services/home-service/home.service';
import { SerieService } from 'src/app/services/serie/serie.service';




@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  animes: CatalogoAnime[] = []
  series: serieCatalogo[] = []
  books: bookCatalogo[] = []

  searchField = new FormControl("", { updateOn: 'change' })

  private cleanList() {
    this.animes = []
    this.series = []
    this.books = []
  }

  searchOptions: search[] = [
    'ANIME',
    'SERIE',
    'BOOK'
  ]

  result: CatalogoAnime[] | bookCatalogo[] | serieCatalogo[] = []

  searchIndex = 0

  isActive = false
  isActiveAccount = false
  isActiveSearch = false;
  username = "USERNAME"
  timeout?: NodeJS.Timeout

  constructor(
    public animeService: AnimeService,
    public serieService: SerieService,
    public bookService: BookService,
    public authService: AuthenticationService,
    public router: Router,
    public homeContext: HomeService
  ) {
    this.searchField.valueChanges.subscribe(() => {
      this.searchEvent()
    })
    if (authService.user) {
      this.username = authService.user.getUsername()!!
    }
  }

  ngOnInit() {
    this.searchField.enable({ emitEvent: true })
  }

  searchEvent() {
    console.log(this.searchField.value.length)
    if (this.searchField.value.length < 3) {
      this.cleanList()
      this.isActiveSearch = false
      return
    }
    this.isActiveSearch = true;
    clearTimeout(this.timeout!!)
    this.timeout = setTimeout(() => {
      if (this.searchField.value.length < 3) { return }
      this.search(this.searchOptions[this.searchIndex])
    }, 1000)
  }

  totalSearch() {
    if (this.searchField.value.length >= 3) {
      this.homeContext.pageSearch(this.searchField.value, 1, this.searchOptions[this.searchIndex])
      this.router.navigateByUrl('home/search',)
    }
  }

  // Definir a categoria no Search
  setSearchIndex(index: number) {
    this.searchIndex = index
    this.isActive = false;
  }

  dropdown() {
    this.isActive = !this.isActive

  }

  dropdownAccount() {
    this.isActiveAccount = !this.isActiveAccount
  }

  closeSearchModal() {
    this.isActiveSearch = false
  }

  search(searchtype: search) {
    this.cleanList()
    switch (searchtype) {
      case 'ANIME':
        this.animeService.partialSearch(this.searchField.value, true).then((value) => {
          this.animes = value
        })
        break
      case 'BOOK':
        this.bookService.partialSearch(this.searchField.value, true).then((value) => {
          this.books = value
        })
        break
      case 'SERIE':
        this.serieService.partialSearch(this.searchField.value, true).then((value) => {
          this.series = value
        })
        break
    }
  }


  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(["/signin"], { replaceUrl: true })
    })
  }
}
