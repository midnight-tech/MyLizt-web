import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
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
  inMyList: boolean = false;

  notRended = true;

  isActiveRecommend = false;

  constructor(
    public listService: ListService,
    public router: Router,
    public homeContext: HomeContextService
  ) {}

  ngOnInit() {
    if (this.notRended) {
      if (this.lookMyList) {
        this.isInMyList();
      } else {
        this.inMyList = true;
      }
      this.notRended = false;
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
          this.inMyList = value;
        });
    } else if (this.book) {
      this.listService.contentInMyList(this.book.id, 'BOOK').then((value) => {
        this.inMyList = value;
      });
    } else if (this.serie) {
      this.listService.contentInMyList(this.serie.id, 'SERIE').then((value) => {
        this.inMyList = value;
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
    console.log(value)
    this.isActiveRecommend = value;
  }
}
