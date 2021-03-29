import { Component, OnInit } from '@angular/core';
import { HomeContextService } from 'src/app/services/home-context/home.service';

@Component({
  selector: 'app-child-a-example',
  templateUrl: './child-a-example.component.html',
  styleUrls: ['./child-a-example.component.scss']
})
export class ChildAExampleComponent implements OnInit {



  constructor(
    public homeService : HomeContextService
  ) {
  }



  ngOnInit() {
  }

}
