import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CarrouselComponent implements OnInit {
  title = 'Wotaku';

  constructor() {}

  ngOnInit() {}
}
