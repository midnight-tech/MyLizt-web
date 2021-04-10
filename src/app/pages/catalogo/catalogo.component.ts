import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeContextService } from 'src/app/services/home-context/home.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  type! : string

  constructor(
    public homeContext: HomeContextService,
    public actRoute : ActivatedRoute,
  ) {
    this.actRoute.params.subscribe((value) => {
      const { type } = value;
      this.type = value.type.toUpperCase() as string
      if (type == 'anime') {
        homeContext.pageCatalogo(1,'ANIME',true)
      } else if (type == 'serie') {
        homeContext.pageCatalogo(1,'SERIE',true)
      } else {
        homeContext.pageCatalogo(1,'BOOK',true)
      }
    });
  }

  ngOnInit() {
  }

}
