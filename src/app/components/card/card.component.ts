import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() anime?: AnimeCatalogo
  @Input() serie?: SerieCatalogo
  @Input() book?: BookCatalogo

  constructor() { }

  ngOnInit() {
  }

}
