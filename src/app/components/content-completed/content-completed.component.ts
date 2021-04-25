import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-completed',
  templateUrl: './content-completed.component.html',
  styleUrls: ['./content-completed.component.scss'],
})
export class ContentCompletedComponent implements OnInit {
  isActiveCompleted = false;

  constructor() {}

  ngOnInit() {}

  changeActiveCompleted() {
    this.isActiveCompleted = !this.isActiveCompleted;
  }
}
