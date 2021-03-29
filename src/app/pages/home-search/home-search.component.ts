import { Component, OnInit } from '@angular/core';
import { HomeContextService } from 'src/app/services/home-context/home.service';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss']
})
export class HomeSearchComponent implements OnInit {

  constructor(public homeContext: HomeContextService) { }

  ngOnInit(
  ) {
  }

}
