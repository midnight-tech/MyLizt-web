import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { Notification } from 'src/app/data/converters';
import {
  CatalogoAnimeInterface,
  search,
  SerieCatalogoInterface,
} from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { BookService } from 'src/app/services/book/book.service';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SerieService } from 'src/app/services/serie/serie.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnChanges {
  @Output() showMenuEvent = new EventEmitter<boolean>();

  animes: AnimeCatalogo[] = [];
  series: SerieCatalogo[] = [];
  books: BookCatalogo[] = [];

  searchField = new FormControl('', { updateOn: 'change' });

  private cleanList() {
    this.animes = [];
    this.series = [];
    this.books = [];
  }

  searchOptions: search[] = ['ANIME', 'SERIE', 'BOOK'];

  result:
    | CatalogoAnimeInterface[]
    | BookCatalogo[]
    | SerieCatalogoInterface[] = [];

  searchIndex = 0;

  isActive = false;
  isActiveAccount = false;
  isActiveSearch = false;
  isActiveMiniSearch = false;
  isActiveNotification = false;
  timeout?: NodeJS.Timeout;
  username = 'USERNAME';
  searchIsFocused = false;

  constructor(
    public animeService: AnimeService,
    public serieService: SerieService,
    public bookService: BookService,
    public authService: AuthenticationService,
    public router: Router,
    public homeContext: HomeContextService,
    public notificationService: NotificationService,
    public userService: UserService
  ) {
    this.username = authService.user?.displayName!;
    this.searchField.valueChanges.subscribe(() => {
      this.searchEvent();
    });
  }

  ngOnInit() {
    this.searchField.enable({ emitEvent: true });
    document.body.addEventListener("keydown", (event) => {
      if (event.key == "Enter" && this.searchIsFocused == true) {
        event.preventDefault()
        this.totalSearch()
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.username = this.authService.user?.displayName!!;
  }

  searchEvent() {
    this.searchIsFocused = true;
    if (this.searchField.value.length < 3) {
      this.cleanList();
      this.isActiveSearch = false;
      return;
    }
    this.isActiveSearch = true;
    clearTimeout(this.timeout!!);
    this.timeout = setTimeout(() => {
      if (this.searchField.value.length < 3) {
        return;
      }
      this.search(this.searchOptions[this.searchIndex]);
    }, 1000);
  }

  totalSearch() {
    if (this.searchField.value.length >= 3) {
      this.isActiveSearch = false;
      this.homeContext.query = this.searchField.value;
      this.homeContext.searchType = this.searchOptions[this.searchIndex];
      this.router.navigateByUrl('home/search');
    }
  }

  // Definir a categoria no Search
  setSearchIndex(index: number) {
    this.searchIndex = index;
    this.isActive = false;
  }

  dropdown() {
    this.isActive = !this.isActive;
  }

  dropdownAccount() {
    this.isActiveAccount = !this.isActiveAccount;
  }

  dropdownNotification() {
    this.isActiveNotification = !this.isActiveNotification;
  }

  closeSearchModal() {
    this.isActiveSearch = false;
    this.isActiveMiniSearch = false;
  }

  showMiniSeach() {
    this.isActiveMiniSearch = !this.isActiveMiniSearch;
  }

  search(searchtype: search) {
    this.cleanList();
    switch (searchtype) {
      case 'ANIME':
        this.animeService
          .partialSearch(this.searchField.value, true)
          .then((value) => {
            this.animes = value;
          });
        break;
      case 'BOOK':
        this.bookService
          .partialSearch(this.searchField.value, true)
          .then((value) => {
            this.books = value;
          });
        break;
      case 'SERIE':
        this.serieService
          .partialSearch(this.searchField.value, true)
          .then((value) => {
            this.series = value;
          });
        break;
    }
  }

  navigateToDetail(id: string, type: string) {
    this.isActiveSearch = false;
    this.isActiveMiniSearch = false;
    this.isActiveNotification = false;
    this.router.navigate(['home', 'detail', type, id], {
      replaceUrl: true,
    });
  }

  navigateToFriends() {
    this.isActiveAccount = false;
    this.router.navigate(['home', 'friends']);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/signin'], { replaceUrl: true });
    });
  }

  acceptUserFriendRequest(id: string, notification: Notification) {
    this.userService.acceptFriendRequest(id).then((value) => {
      if (value) {
        this.notificationService.deleteNotification(notification)
      }
    })
  }
}
