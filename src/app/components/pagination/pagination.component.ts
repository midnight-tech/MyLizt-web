import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HomeContextService } from 'src/app/services/home-context/home.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() atualPage: number = 1
  @Input() totalPage: number = 8
  pages: number[] = []
  init = true
  activated = false

  constructor(public homeContext: HomeContextService) {

  }

  initPages() {
    let maxPage = this.homeContext.totalPage <= 8 ? this.homeContext.totalPage : 8
    if (this.homeContext.totalPage == 0) {
      maxPage = 8
      this.activated = false
    } else {
      this.activated = true
    }
    for (let i = 1; i <= maxPage; i += 1) {
      this.pages.push(i)
    }
  }

  changePage(page: number) {
    let startPage = 1
    let endPage : number
    if (page > 2) {
      startPage = page - 2
    }

    if (page + 7 > this.totalPage) {
      endPage = this.totalPage
      if(this.totalPage - 10 >= 1){
        startPage = this.totalPage - 9
      } else {
        startPage = 1
      }
    } else {
      endPage = page + 7
    }
    this.pages = []
    for (let i = startPage; i <= endPage; i += 1) {
      this.pages.push(i)
    }
    // seleciona a page

  }
  ngOnChanges(changes: SimpleChanges) {
    this.changePage(this.atualPage)
  }

  ngOnInit() {
    this.initPages()
  }

}
