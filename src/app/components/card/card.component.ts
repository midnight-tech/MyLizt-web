import { Component, Input, NgZone, OnChanges, OnInit } from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
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

  inMyList: boolean = false
  notRended = true

  constructor(
    public listService: ListService,
    public ngZone : NgZone
  ) { }

  ngOnInit() {
    if(this.notRended){
      this.isInMyList()
      this.notRended = false
    }
  }

  addToMyList() {
    if (this.anime) {
      this.listService.addContent(this.anime.mal_id, 'ANIME').then(() => {
        this.notRended = true
        this.ngOnInit()
      })
    } else if (this.book) {
      this.listService.addContent(this.book.id, 'BOOK').then(() => {
        this.notRended = true
        this.ngOnInit()
      })
    } else if (this.serie) {
      this.listService.addContent(this.serie.id, 'SERIE').then(() => {
        this.notRended = true
        this.ngOnInit()
      })
    }
  }

  isInMyList() {
    if (this.anime) {
      this.listService.contentInMyList(this.anime.mal_id, 'ANIME').then((value) => {
        this.inMyList = value
      })
    } else if (this.book) {
      this.listService.contentInMyList(this.book.id, 'BOOK').then((value) => {
        this.inMyList = value
      })
    } else if (this.serie) {
      this.listService.contentInMyList(this.serie.id, 'SERIE').then((value) => {
        this.inMyList = value
      })
    }
  }

}
