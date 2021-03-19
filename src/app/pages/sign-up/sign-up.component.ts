import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  username = new FormControl("")
  email = new FormControl("")
  password = new FormControl("")
  confirm_password = new FormControl("")
  authService: AuthenticationService
  router : Router


  constructor(auth: AuthenticationService, router: Router) {
    this.authService = auth
    this.router = router
  }

  ngOnInit() {
  }

  register() {
    if (this.password.value == this.confirm_password.value) {
      this.authService.signUpWithEmail(this.username.value, this.email.value, this.password.value).then(() => {
        this.router.navigate(['/verification'],{replaceUrl : true})
      })
    }
  }

}
