import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, AfterViewInit {
  email = new FormControl('');
  password = new FormControl('');

  popUpLoaded = false;

  @ViewChild('popUpLogin') popUpView!: PopUpComponent;

  constructor(
    private authService: AuthenticationService,
    private routes: Router
  ) {}

  ngAfterViewInit(): void {
    this.popUpLoaded = true;
  }

  ngOnInit() {}

  loginWithEmail() {
    if (this.email.value.length == 0) {
      this.activatePopUp('Email empty');
      return;
    }
    if (this.password.value.length == 0) {
      this.activatePopUp('Password empty');
      return;
    }
    this.authService
      .signIn(this.email.value, this.password.value)
      .then(() => {
        // Success
        this.email.setValue('');
        this.password.setValue('');
      })
      .catch((error) => {
        if (error == 'User email is not verified.') {
          this.routes.navigate(['/verification']);
          this.email.setValue('');
          this.password.setValue('');
        }
        switch (error.code) {
          case 'auth/wrong-password':
            this.activatePopUp('The password is invalid');
            return;
          case 'auth/user-not-found':
            this.activatePopUp('There is no user corresponding to this email');
            break;
          case 'auth/invalid-email':
            this.activatePopUp(error.message);
        }
      });
  }

  loginWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then(() => {})
      .catch((error) => {
        this.activatePopUp(error.message);
      });
  }

  loginWithFacebook() {
    this.authService
      .signInWithFacebook()
      .then(() => {})
      .catch((error) => {
        this.activatePopUp(error.message);
      });
  }

  loginWithTwitter() {
    this.activatePopUp('signin with twitter not implemented yet');
    return;
    // this.authService.signInWithTwitter().then(() => {
    // }).catch((error) => {
    //   this.providerError = error.message;
    // })
  }

  loginWithApple() {
    this.authService
      .signInWithApple()
      .then(() => {})
      .catch((error) => {
        this.activatePopUp('signin with twitter not implemented yet');
      });
  }

  resetPassword() {
    this.authService.resetPassword(this.email.value).then((value) => {
      this.activatePopUp(value.message);
    });
  }

  activatePopUp(message: string) {
    if (this.popUpLoaded) {
      this.popUpView.showPopUp(message);
    }
  }
}
