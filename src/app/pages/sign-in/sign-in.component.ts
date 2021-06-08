import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  email = new FormControl("")
  emailError = ""
  emailMessage = ""
  password = new FormControl("")
  passwordError = ""


  constructor(
    private authService: AuthenticationService,
    private routes: Router,
  ) {
    this.email.valueChanges.subscribe((value) => {
      this.cleanError()
    })
    this.password.valueChanges.subscribe((value) => {
      this.cleanError()
    })
  }

  private cleanError() {
    this.emailError = ""
    this.passwordError = ""
    this.emailMessage = ""
  }

  ngOnInit() {
  }

  loginWithEmail() {
    if (this.email.value.length == 0) {
      this.emailError = "Email empty"
      return
    }
    if (this.password.value.length == 0) {
      this.passwordError = "Password empty"
      return
    }
    this.authService.signIn(this.email.value, this.password.value).then(() => {
      // Success
      this.email.setValue("")
      this.password.setValue("")
    }).catch((error) => {
      if (error == "User email is not verified.") {
        this.routes.navigate(['/verification'])
        this.email.setValue("")
        this.password.setValue("")
      }
      switch (error.code) {
        case 'auth/wrong-password':
          this.passwordError = "the password is invalid"
          return
        case 'auth/user-not-found':
          this.emailError = "There is no user corresponding to this email"
      }
    })
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle().then(() => {
    }).catch((error) => {
      this.email
    })
  }

  loginWithFacebook() {
    this.authService.signInWithFacebook().then(() => {
    }).catch((error) => {

    })
  }

  loginWithTwitter() {
    this.authService.signInWithTwitter().then(() => {
    }).catch((error) => {

    })
  }

  loginWithApple() {
    this.authService.signInWithApple().then(() => {
    }).catch((error) => {

    })
  }

  resetPassword() {
    this.authService.resetPassword(this.email.value).then((value) => {
      if (value.correct) {
        this.emailMessage = value.message
      } else {
        this.emailError = value.message
      }
    })
  }

}
