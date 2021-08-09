import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
})
export class PopUpComponent implements OnInit {
  popUpTrigger = false;
  popUpMessage = '';
  timeOut: any;

  constructor() {}

  showPopUp(message: string) {
    this.popUpTrigger = true;
    this.popUpMessage = message;

    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.popUpTrigger = false;
      this.popUpMessage = '';
    }, 6000);
  }

  ngOnInit() {}

  dismissPopUp() {
    clearTimeout(this.timeOut);
    this.popUpMessage = '';
    this.popUpTrigger = false;
  }
}
