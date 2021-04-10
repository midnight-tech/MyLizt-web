import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-carrousel',
  templateUrl: './home-carrousel.component.html',
  styleUrls: ['./home-carrousel.component.scss']
})
export class HomeCarrouselComponent implements OnInit {

  constructor(
    private router : Router
  ) { }

  ngOnInit() {
  }

  navigateToCatalogo(type : string){
    this.router.navigate(['home','catalogo',type])
  }

}
