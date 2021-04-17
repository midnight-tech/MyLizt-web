import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss']
})
export class MyListComponent implements OnInit {

  type: string = ""

  constructor(
    actRoute: ActivatedRoute,
    private listService: ListService,
    public homeContext: HomeContextService,
  ) {
    actRoute.params.subscribe((value) => {
      this.type = value.type
      homeContext.cleanContentMyList()
      this.homeContext.changePage(1, 'myContent', value.type)
    })
  }

  ngOnInit() {
  }
}
