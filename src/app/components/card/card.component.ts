import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { ListService } from 'src/app/services/list/list.service';

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
  @Input() pageCall? : 'myList' | 'recommendation' | 'friendList' | 'loading' | 'other' = 'other'
  @Input() friendContent? : content
  @Input() loading : boolean = false
  inMyList: boolean = false;
  mycontent?: content;
  

  notRended = true;

  isActiveRecommend = false;

  constructor(
    public listService: ListService,
    public router: Router,
    public homeContext: HomeContextService
  ) {}

  ngOnInit() {
    if(this.pageCall == undefined){
      throw "pageCall in card can not be undefined"
    }
    if(this.pageCall == 'friendList'){
      if(this.friendContent == undefined){
        throw "friendContent undefined"
      }
    }
    if (this.notRended) {
      if (this.lookMyList) {
        this.isInMyList();
      } else {
        this.inMyList = true;
        this.getContent();
      }
      this.notRended = false;
    }
  }

  getContent() {
    if (this.anime) {
      this.listService
        .contentInMyList(this.anime.mal_id, 'ANIME')
        .then((value) => {
          if (value.exists) {
            this.mycontent = value.data()!;
            this.mycontent.ref = value.ref;
          }
        });
    } else if (this.book) {
      this.listService.contentInMyList(this.book.id, 'BOOK').then((value) => {
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
        }
      });
    } else if (this.serie) {
      this.listService.contentInMyList(this.serie.id, 'SERIE').then((value) => {
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
        }
      });
    }
  }

  addToMyList() {
    if (this.anime) {
      this.listService.addContent(this.anime.mal_id, 'ANIME').then(() => {
        this.notRended = true;
        this.ngOnInit();
      });
    } else if (this.book) {
      this.listService.addContent(this.book.id, 'BOOK').then(() => {
        this.notRended = true;
        this.ngOnInit();
      });
    } else if (this.serie) {
      this.listService.addContent(this.serie.id, 'SERIE').then(() => {
        this.notRended = true;
        this.ngOnInit();
      });
    }
  }

  deleteToMyList() {
    if (this.anime) {
      this.listService
        .removeFromList(this.anime.mal_id.toString(), 'anime')
        .then(() => {
          this.notRended = true;
          this.ngOnInit();
        });
    } else if (this.book) {
      this.listService.removeFromList(this.book.id, 'book').then(() => {
        this.notRended = true;
        this.ngOnInit();
      });
    } else if (this.serie) {
      this.listService
        .removeFromList(this.serie.id.toString(), 'serie')
        .then(() => {
          this.notRended = true;
          this.ngOnInit();
        });
    }
  }

  isInMyList() {
    if (this.anime) {
      this.listService
        .contentInMyList(this.anime.mal_id, 'ANIME')
        .then((value) => {
          this.inMyList = value.exists;
          if (value.exists) {
            this.mycontent = value.data()!;
            this.mycontent.ref = value.ref;
          }
        });
    } else if (this.book) {
      this.listService.contentInMyList(this.book.id, 'BOOK').then((value) => {
        this.inMyList = value.exists;
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
        }
      });
    } else if (this.serie) {
      this.listService.contentInMyList(this.serie.id, 'SERIE').then((value) => {
        this.inMyList = value.exists;
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
        }
      });
    }
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

  getComplete(){
    if(this.anime){
      this.anime.getComplete()
      return
    }
    if(this.serie){
      this.serie.getComplete()
      return
    }
    if(this.book){
      this.book.getComplete()
      return
    }
  }
}
