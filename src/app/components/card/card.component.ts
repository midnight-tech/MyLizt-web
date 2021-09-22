import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { ListService } from 'src/app/services/list/list.service';
import { RecAuxService } from 'src/app/services/rec-aux/rec-aux-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() anime?: AnimeCatalogo;
  @Input() serie?: SerieCatalogo;
  @Input() book?: BookCatalogo;
  @Input() lookMyList: boolean = true;
  @Input() pageCall?:
    | 'myList'
    | 'recommendation'
    | 'friendList'
    | 'loading'
    | 'other' = 'other';
  @Input() friendContent?: content;
  @Input() loading: boolean = false;
  inMyList: boolean = false;
  @Input() mycontent?: content;
  removed = false
  added = false

  notRended = true;

  isActiveRecommend = false;

  constructor(
    public listService: ListService,
    public router: Router,
    public homeContext: HomeContextService,
    private userService: UserService,
    private recAuxService: RecAuxService,
  ) { }

  ngOnInit() {
    if (this.pageCall == undefined) {
      throw 'pageCall in card can not be undefined';
    }
    if (this.pageCall == 'friendList') {
      if (this.friendContent == undefined) {
        throw 'friendContent undefined';
      }
    }
    if (this.pageCall == 'recommendation') {
      this.added = this.recAuxService.contentInAddedContent(this.mycontent!.contentId.toString());
      this.removed = this.recAuxService.contentInRemovedContent(this.mycontent!.contentId.toString());
    }
    if (this.notRended) {
      if (this.lookMyList) {
        this.isInMyList();
      } else {
        this.inMyList = true;
      }
      this.notRended = false;
    }
    this.getUsernames();
  }

  addToMyList() {
    let type: search
    let id

    if (this.anime) {
      type = 'ANIME'
      id = this.anime.mal_id
    }
    else if (this.book) {
      type = 'BOOK'
      id = this.book.id
    }
    else if (this.serie) {
      type = 'SERIE'
      id = this.serie.id
    } else {
      throw "content invalid"
    }
    this.listService.addContent(id, type).then(() => {
      this.notRended = true;
      this.ngOnInit();
    });
  }

  addToMyListFromRecommendation() {
    if (this.mycontent == undefined) {
      return;
    }
    let contentCopy = this.mycontent;
    contentCopy.recommended = null;
    this.listService
      .editContent(contentCopy, true, true)
      .then((value) => {
        this.mycontent = value;
        this.added = true
        this.recAuxService.addAddedContent(this.mycontent.contentId.toString())
      });
  }

  deleteToMyList() {
    if (this.mycontent == undefined) {
      throw 'myContent undefined';
    }
    this.listService.removeFromList(this.mycontent).then(() => {
      this.notRended = true;
      this.ngOnInit();
    });
  }

  deleteToMyListRec() {
    if (this.mycontent == undefined) {
      throw 'myContent undefined';
    }
    this.listService.removeRec(this.mycontent).then(() => {
      this.removed = true
      this.recAuxService.addRemovedContent(this.mycontent!.contentId.toString())
      this.notRended = true;
      this.ngOnInit();
    });
  }

  isInMyList() {
    let type: search
    let id

    if (this.anime) {
      type = 'ANIME'
      id = this.anime.mal_id
    }
    else if (this.book) {
      type = 'BOOK'
      id = this.book.id
    }
    else if (this.serie) {
      type = 'SERIE'
      id = this.serie.id
    } else {
      throw "content invalid"
    }
    this.listService
      .contentInMyList(id, type)
      .then((value) => {
        this.inMyList = value.exists;
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
          this.getUsernames();
        }
      });

  }

  navigateToDetail() {
    if (this.anime) {
      this.router.navigate(['home', 'detail', 'anime', this.anime.mal_id]);
    } else if (this.book) {
      this.router.navigate(['home', 'detail', 'book', this.book.id]);
    } else if (this.serie) {
      this.router.navigate(['home', 'detail', 'serie', this.serie.id]);
    }
  }

  disableReceiveRecommendation(value: boolean) {
    this.isActiveRecommend = value;
  }

  getComplete() {
    if (this.anime) {
      this.anime.getComplete();
      return;
    }
    if (this.serie) {
      this.serie.getComplete();
      return;
    }
    if (this.book) {
      this.book.getComplete();
      return;
    }
  }

  userRec: string[] = [];

  async getUsernames() {
    this.userRec = [];
    if (this.mycontent && this.mycontent.recommended != null) {
      this.userRec = await this.userService.getUserNameArray(
        this.mycontent!.recommended!
      );
    }
  }
}
