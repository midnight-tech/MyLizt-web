import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'],
})
export class RecommendationComponent implements OnInit {
  @Input() isActiveRecommend = false;
  @Output() isActiveEvent = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  showRecommendation() {
    this.isActiveRecommend = !this.isActiveRecommend;
  }

  disableRecommendation() {
    this.isActiveEvent.emit(false);
  }
}
