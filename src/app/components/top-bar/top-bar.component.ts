import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { CatalogoAnimeInterface, search, SerieCatalogoInterface } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { BookService } from 'src/app/services/book/book.service';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { SerieService } from 'src/app/services/serie/serie.service';




@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnChanges {

  animes: AnimeCatalogo[] = []
  series: SerieCatalogo[] = []
  books: BookCatalogo[] = []

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

  result: CatalogoAnimeInterface[] | BookCatalogo[] | SerieCatalogoInterface[] = []

  searchIndex = 0

  isActive = false
  isActiveAccount = false
  isActiveSearch = false;
  timeout?: NodeJS.Timeout
  username = 'USERNAME'

  constructor(
    public animeService: AnimeService,
    public serieService: SerieService,
    public bookService: BookService,
    public authService: AuthenticationService,
    public router: Router,
    public homeContext: HomeContextService
  ) {
    this.username = authService.user?.displayName!
    this.searchField.valueChanges.subscribe(() => {
      this.searchEvent()
    })
  }

  ngOnInit() {
    this.searchField.enable({ emitEvent: true })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.username = this.authService.user?.displayName!!
  }

  searchEvent() {
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
      this.isActiveSearch = false
      this.homeContext.pageSearch(this.searchField.value, 1, this.searchOptions[this.searchIndex])
      this.router.navigateByUrl('home/search')
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

  navigateToDetail(id:string,type : string){
    this.isActiveSearch = false
    this.router.navigate(['home','detail',type,id])
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(["/signin"], { replaceUrl: true })
    })
  }
}
