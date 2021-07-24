import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CarrousselEntry } from 'src/app/data/interfaces';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CarrouselComponent implements OnInit, AfterViewInit {
  @Input() contents!: CarrousselEntry[];

  @Input() type!: string;

  config = {
    slidesPerView: 3.5,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
  };

  constructor(private router: Router) {
    window.addEventListener('resize', () => {
      this.mediaQueryCarrousel();
    });
  }

  ngAfterViewInit(): void {
    this.mediaQueryCarrousel();
  }

  ngOnInit() {
    // console.log(window.innerWidth);
  }

  navigateToDetail(type: string, id: string) {
    this.router.navigate(['home', 'detail', type, id]);
  }

  mediaQueryCarrousel() {
    if (window.innerWidth <= 400) {
      this.config.slidesPerView = 1.25;
      this.config.spaceBetween = 15;
    } else if (window.innerWidth <= 600) {
      this.config.slidesPerView = 1.5;
      this.config.spaceBetween = 15;
    } else if (window.innerWidth <= 800) {
      this.config.slidesPerView = 2.25;
      this.config.spaceBetween = 15;
    } else if (window.innerWidth <= 1000) {
      this.config.slidesPerView = 2.5;
      this.config.spaceBetween = 30;
    } else if (window.innerWidth <= 1200) {
      this.config.slidesPerView = 3.25;
      this.config.spaceBetween = 30;
    } else {
      this.config.slidesPerView = 4;
      this.config.spaceBetween = 30;
    }
  }
}
