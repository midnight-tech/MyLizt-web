import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search, UserInterface } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CatalogoPaginationService } from 'src/app/services/pagination/catalogo-pagination.service';
import { FriendListPaginationService } from 'src/app/services/pagination/friend-list-pagination.service';
import { FriendPaginationService } from 'src/app/services/pagination/friend-pagination.service';
import { MyListPaginationService } from 'src/app/services/pagination/my-list-pagination.service';
import { MyRecsPaginationService } from 'src/app/services/pagination/myRecs-pagination.service';
import { SearchPaginationService } from 'src/app/services/pagination/search-pagination.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {
  @Output() visibleListAnime = new EventEmitter<AnimeCatalogo[]>();
  @Output() visibleListSerie = new EventEmitter<SerieCatalogo[]>();
  @Output() visibleListBook = new EventEmitter<BookCatalogo[]>();

  @Output() visibleContentAnime = new EventEmitter<
    { anime: AnimeCatalogo; content: content }[]
  >();
  @Output() visibleContentSerie = new EventEmitter<
    { serie: SerieCatalogo; content: content }[]
  >();
  @Output() visibleContentBook = new EventEmitter<
    { book: BookCatalogo; content: content }[]
  >();

  @Output() visibleFriend = new EventEmitter<{
    user: UserInterface;
    aniCount: any
    serieCount: any
    bookCount: any
  }[]>()

  @Output() softLoading = new EventEmitter<boolean>(false)

  @Input() type?: search;
  @Input() friendId: string = '';
  @Input() query?: string;
  @Input() completePage = true
  @Input() update: boolean = false
  @Input() pageCalled?:
    | 'search'
    | 'myContent'
    | 'friend'
    | 'catalogo'
    | 'friendList'
    | 'myRec';
  atualPage: number = 1;
  totalPage: number = 8;
  pages: number[] = [];
  init = false;
  activated = false;


  constructor(
    public homeContext: HomeContextService,
    private searchPagination: SearchPaginationService,
    private catalogoPagination: CatalogoPaginationService,
    private friendListPagination: FriendListPaginationService,
    private myListPagination: MyListPaginationService,
    private myRecPagination: MyRecsPaginationService,
    private friendPagination: FriendPaginationService,
    private loadingService: LoadingService
  ) {
    if (this.pageCalled) {
      this.pageCalled = 'search';
    }
  }
  ngOnDestroy(): void {
    this.softLoading.emit(false)
    this.clean()
  }

  async initPages() {
    // Quando o componente inicializa
    switch (this.pageCalled) {
      case 'search':
      case 'catalogo':
        this.clean()
        this.softLoading.emit(true)
        await this.changePageCatalogo(this.pageCalled);
        this.softLoading.emit(false)
        break;
      case 'friendList':
      case 'myContent':
      case 'myRec':
        this.loadingService.isLoading = true;
        this.changePageWithContent(this.pageCalled).then(() => {
          this.loadingService.isLoading = false;
        });
        break;
      case 'friend':
        this.paginationInterfaceInit(1);
        this.loadingService.isLoading = true;
        this.paginationChangeFriend().then(() => {
          this.loadingService.isLoading = false;
        });
    }
  }

  async changePage(page: number) {
    // Execulta a cada troca de pagina
    if (this.loadingService.isLoading) {
      return;
    }
    if (this.atualPage == page) {
      return;
    }
    if (this.pageCalled != 'friend' && (page <= 0 || page > this.totalPage)) {
      return;
    }
    if (this.pageCalled != 'friend') {
      this.atualPage = page;
    }
    // this.clean();
    switch (this.pageCalled) {
      case 'search':
      case 'catalogo':
        this.softLoading.emit(true)
        await this.changePageCatalogo(this.pageCalled, page);
        this.softLoading.emit(false)
        break;
      case 'friendList':
      case 'myContent':
      case 'myRec':
        this.loadingService.isLoading = true;
        this.changePageWithContent(this.pageCalled, page).then(() => {
          this.loadingService.isLoading = false;
        });
        break
      case 'friend':
        this.loadingService.isLoading = true;
        this.paginationChangeFriend(page).then(() => {
          this.loadingService.isLoading = false;
        });
    }
  }

  paginationInterfaceInit(totalPage: number) {
    // prepara a interface
    let maxPage = totalPage <= 8 ? totalPage : 8;
    if (totalPage == 0) {
      maxPage = 8;
      this.activated = false;
    } else {
      this.activated = true;
    }
    for (let i = 1; i <= maxPage; i += 1) {
      this.pages.push(i);
    }
  }

  paginationChageInterface() {
    // prepara a interface
    let startPage = 1;
    let endPage: number;
    if (this.atualPage > 2) {
      startPage = this.atualPage - 2;
    }

    if (this.atualPage + 7 > this.totalPage) {
      endPage = this.totalPage;
      if (this.totalPage - 10 >= 1) {
        startPage = this.totalPage - 9;
      } else {
        startPage = 1;
      }
    } else {
      endPage = this.atualPage + 7;
    }
    this.pages = [];
    for (let i = startPage; i <= endPage; i += 1) {
      this.pages.push(i);
    }
    // seleciona a page
  }

  async changePageCatalogo(pageCalled: 'search' | 'catalogo', page?: number) {
    // Paginação na tela search
    if (pageCalled == 'search' && this.query == undefined) {
      throw 'query canot be undefined in search page';
    }
    if (this.type == undefined) {
      throw 'type cannot be undefined in search page';
    }
    let result: {
      result: AnimeCatalogo[];
      totalPage: number;
    } | {
      result: BookCatalogo[];
      totalPage: number;
    } | {
      result: SerieCatalogo[];
      totalPage: number;
    };
    switch (pageCalled) {
      case 'catalogo':
        result = await this.catalogoPagination.pageCatalogo(
          page != undefined ? page : 1,
          this.type
        );
        break;
      case 'search':
        result = await this.searchPagination.pageSearch(
          this.query!,
          page != undefined ? page : 1,
          this.type
        );
    }
    switch (this.type) {
      case 'ANIME':
        this.visibleListAnime.emit(result.result as AnimeCatalogo[]);
        this.totalPage = result.totalPage;
        break;
      case 'SERIE':
        console.log(result)
        this.visibleListSerie.emit(result.result as SerieCatalogo[]);
        this.totalPage = result.totalPage;
        break;
      case 'BOOK':
        this.visibleListBook.emit(result.result as BookCatalogo[]);
        this.totalPage = result.totalPage;
    }
    if (page != undefined) {
      this.paginationChageInterface();
    } else {
      this.paginationInterfaceInit(result.totalPage);
    }
  }

  async paginationChangeFriend(page?: number) {
    if (page == undefined) {
      this.friendPagination.clean()
    }
    const result = await this.friendPagination.friendPagination(
      page != undefined ? page : 1,
    )
    if (result == undefined || result.length == 0) {
      return
    }
    if (page) {
      this.atualPage = page
    }
    this.visibleFriend.emit(result)
    if (page != undefined) {
      this.paginationChageInterface();
    } else {
      // this.paginationInterfaceInit(1)
    }
  }

  async changePageWithContent(
    pageCalled: 'myContent' | 'friendList' | 'myRec',
    page?: number
  ) {
    if (this.type == undefined) {
      throw 'type cannot be undefined';
    }
    let result:
      {
        result: {
          anime: AnimeCatalogo;
          content: content;
        }[];
        totalPage: number;
      }
      | {
        result: {
          serie: SerieCatalogo;
          content: content;
        }[];
        totalPage: number;
      }
      | {
        result: {
          book: BookCatalogo;
          content: content;
        }[];
        totalPage: number;
      };

    if (page == undefined) {
      this.friendListPagination.clean()
      this.myRecPagination.clean()
      this.myListPagination.clean()
    }
    switch (pageCalled) {
      case 'friendList':
        result = await this.friendListPagination.friendListPage(
          page != undefined ? page : 1,
          this.type,
          this.friendId
        );
        break;
      case 'myContent':
        result = await this.myListPagination.myListPage(
          page != undefined ? page : 1,
          this.type
        );
        break;
      case 'myRec':
        result = await this.myRecPagination.MyRecListPage(
          page != undefined ? page : 1,
          this.type
        );
        break;
    }
    switch (this.type) {
      case 'ANIME':
        this.visibleContentAnime.emit(
          result.result as {
            anime: AnimeCatalogo;
            content: content;
          }[]
        );
        this.totalPage = result.totalPage;
        break;
      case 'SERIE':
        this.visibleContentSerie.emit(
          result.result as {
            serie: SerieCatalogo;
            content: content;
          }[]
        );
        this.totalPage = result.totalPage;
        break;
      case 'BOOK':
        this.visibleContentBook.emit(
          result.result as {
            book: BookCatalogo;
            content: content;
          }[]
        );
        this.totalPage = result.totalPage;
    }
    if (page != undefined) {
      this.paginationChageInterface();
    } else {
      this.paginationInterfaceInit(result.totalPage);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.loadingService.isLoading) {
      return
    }
    if (this.init) {
      if (changes.query || changes.type || changes.friendId || changes.update) {
        this.searchPagination.cleanPage()
        this.pages = [];
        this.clean();
        this.atualPage = 1;
        this.totalPage = 8
        this.initPages();
        return;
      }
    }
  }

  clean() {
    this.visibleListAnime.emit([]);
    this.visibleListBook.emit([]);
    this.visibleListSerie.emit([]);
    this.visibleContentAnime.emit([]);
    this.visibleContentSerie.emit([]);
    this.visibleContentBook.emit([]);
    this.visibleFriend.emit([]);
  }

  ngOnInit() {
    this.clean()
    this.initPages();
    this.init = true;
  }

  // my-list page
}
