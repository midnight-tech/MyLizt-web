import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnInit {

  listOfitem = ['Violet Evergarden', 'Violet Evergarden The Movie', 'Violet Evergarden Ova 1', 'Violet Evergarden Ova 2', 'Violet Evergarden Eien to Jidou Shuki']

  constructor() { }

  ngOnInit() {
  }

}
