import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { search } from 'src/app/data/interfaces';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss']
})
export class MyListComponent implements OnInit {

  type!: search

  constructor(
    actRoute: ActivatedRoute,
    private listService: ListService,
    public homeContext: HomeContextService,
  ) {
    actRoute.params.subscribe((value) => {
      this.type = value.type.toUpperCase()
      homeContext.cleanContentMyList()
      this.homeContext.changePage(1, 'myContent', this.type)
    })
  }

  ngOnInit() {
  }
}
