import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home-service/home.service';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss']
})
export class HomeSearchComponent implements OnInit {

  constructor(public homeContext: HomeService) { }

  ngOnInit(
  ) {
  }

}
