import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer-company',
  templateUrl: './footer-company.component.html',
  styleUrls: ['./footer-company.component.scss']
})
export class FooterCompanyComponent implements OnInit {

  version

  constructor() {
    this.version = environment.version
  }

  ngOnInit() {

  }

}
