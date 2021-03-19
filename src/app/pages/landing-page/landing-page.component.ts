import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(public routes: Router, public thisRoute: ActivatedRoute, auth: AuthenticationService) {
    if (auth.isLogged) {
      this.navigateLogged()
    }
  }

  navigateLogged() {
    this.routes.navigate(['/home'], { replaceUrl: true, relativeTo: this.thisRoute })
  }

  ngOnInit() {
  }

}
