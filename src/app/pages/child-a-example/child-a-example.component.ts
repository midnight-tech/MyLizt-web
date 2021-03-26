import { Component, OnInit } from '@angular/core';
import { bookCatalogo, CatalogoAnime, serieCatalogo } from 'src/app/data/interfaces';
import { HomeService } from 'src/app/services/home-service/home.service';

@Component({
  selector: 'app-child-a-example',
  templateUrl: './child-a-example.component.html',
  styleUrls: ['./child-a-example.component.scss']
})
export class ChildAExampleComponent implements OnInit {



  constructor(
    public homeService : HomeService
  ) {
  }



  ngOnInit() {
  }

}
