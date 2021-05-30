import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/services/list/list.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isMenuActive = false;

  constructor(
    private listService: ListService,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.listService.getMyList().then((value) => {
    });
  }
}
