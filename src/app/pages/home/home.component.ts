import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private listService : ListService) {
   
  }

  ngOnInit() {
    this.listService.getMyList().then((value)=>{
      console.log(value)
    })
  }

}
