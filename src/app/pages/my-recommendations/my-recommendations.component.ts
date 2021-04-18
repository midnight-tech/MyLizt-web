import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { search } from 'src/app/data/interfaces';
import { HomeContextService } from 'src/app/services/home-context/home.service';

@Component({
  selector: 'app-my-recommendations',
  templateUrl: './my-recommendations.component.html',
  styleUrls: ['./my-recommendations.component.scss']
})
export class MyRecommendationsComponent implements OnInit {

  type! : search 

  constructor(
    public homeContext: HomeContextService,
    actRoute: ActivatedRoute,

  ) {
    actRoute.params.subscribe((value) => {
      this.type = value.type.toUpperCase()
      this.homeContext.changePage(1,'myRec',this.type as search)
    })
  }

  ngOnInit() {
  }

}
