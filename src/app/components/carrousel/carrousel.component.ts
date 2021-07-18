import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CarrousselEntry } from 'src/app/data/interfaces';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CarrouselComponent implements OnInit {
  @Input() contents!: CarrousselEntry[];

  @Input() type!: string;

  constructor(private router: Router) {
    console.log(window.innerWidth);
  }

  ngOnInit() {
    console.log('Eu sou diferente', window.innerWidth);
  }

  navigateToDetail(type: string, id: string) {
    this.router.navigate(['home', 'detail', type, id]);
  }
}
