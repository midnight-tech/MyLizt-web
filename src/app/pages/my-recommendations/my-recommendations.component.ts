import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-my-recommendations',
  templateUrl: './my-recommendations.component.html',
  styleUrls: ['./my-recommendations.component.scss']
})
export class MyRecommendationsComponent implements OnInit {

  anime: { anime: AnimeCatalogo; content: content }[] = [];
  serie: { serie: SerieCatalogo; content: content }[] = [];
  book: { book: BookCatalogo; content: content }[] = [];

  type! : search 

  loadingArray = new Array(12).fill(0)

  constructor(
    public homeContext: HomeContextService,
    actRoute: ActivatedRoute,
    public loadingService : LoadingService

  ) {
    actRoute.params.subscribe((value) => {
      this.type = value.type.toUpperCase()
    })
  }

  ngOnInit() {
  }

}
