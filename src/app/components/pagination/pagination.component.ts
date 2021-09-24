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
import { Router } from '@angular/router';
import { search } from 'src/app/data/interfaces';

import { LoadingService } from 'src/app/services/loading/loading.service';

import { FriendPaginationService } from 'src/app/services/pagination/friend-pagination.service';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {


  @Output() softLoading = new EventEmitter<boolean>(false)

  @Input() type?: search;
  @Input() friendId: string = '';
  @Input() keySearch?: string;
  @Input() completePage = true
  @Input() pageCalled?:
    | 'search'
    | 'myContent'
    | 'friend'
    | 'catalogo'
    | 'friendList'
    | 'myRec';
  @Input() atualPage: number = 1;
  @Input() totalPage: number = -1;
  pages: number[] = [];
  init = false;
  activated = false;

  constructor(
    private friendPagination: FriendPaginationService,
    private loadingService: LoadingService,
    private router: Router,
  ) {
    if (this.pageCalled) {
      this.pageCalled = 'search';
    }
  }
  ngOnDestroy(): void {
    this.softLoading.emit(false)
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
    switch (this.pageCalled) {
      case 'search':
        this.router.navigate(['home', 'search', this.keySearch, this.type?.toLowerCase(), page])
        break;
      case 'catalogo':
        this.router.navigate(['home', 'catalogo', this.type?.toLowerCase(), page])
        break;
      case 'friendList':
        this.router.navigate(['home', 'friend-list', this.friendId, this.type?.toLowerCase().toLowerCase(), page])
        break;
      case 'myContent':
        this.router.navigate(['home', 'my-list', this.type?.toLowerCase(), page])
        break
      case 'myRec':
        this.router.navigate(['home', 'recommendations', this.type?.toLowerCase(), page])
        break
      case 'friend':
        this.router.navigate(['home', 'friends', page])
    }
    window.scroll(0, 0)
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
    if (page != undefined) {
      this.paginationChageInterface();
    } else {
      // this.paginationInterfaceInit(1)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.totalPage != 0) {
      this.paginationInterfaceInit(this.totalPage)
      this.paginationChageInterface()
    }
  }

  ngOnInit() {

    // this.paginationInterfaceInit(this.totalPage)
    this.init = true;
  }

  // my-list page
}
