import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

const errorDefault = {
  username: "",
  email: "",
  password: "",
  confirm_password: "",
  other: ""
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  error
  username = new FormControl("")
  email = new FormControl("")
  password = new FormControl("")
  confirm_password = new FormControl("")


  constructor(private authService: AuthenticationService, private router: Router) {
    this.error = errorDefault
    this.username.valueChanges.subscribe((value) => {
      this.resetError()
    })
    this.email.valueChanges.subscribe(() => {
      this.resetError()
    })
    this.password.valueChanges.subscribe(() => {
      this.resetError()
    })
    this.confirm_password.valueChanges.subscribe(() => {
      this.resetError()
    })
  }

  ngOnInit() {
  }

  private resetError() {
    this.error.username = ""
    this.error.email = ""
    this.error.password = ""
    this.error.confirm_password = ""
    this.error.other = ""
  }

  register() {
    if (this.username.value.length >= 30) {
      this.error.username = "Too many caracters"
      return
    }
    if (this.username.value.length == 0) {
      this.error.username = "Field can not be empty"
      return
    }
    if (this.password.value == this.confirm_password.value) {
      this.authService.signUpWithEmail(this.username.value, this.email.value, this.password.value).then(() => {
      }).catch((erro) => {
        switch (erro.code) {
          case 'auth/weak-password':
          case 'auth/email-already-in-use':
            this.error.password = erro.message
            break
          case 'auth/invalid-email':
            this.error.email = erro.message
            break
        }
      })
    } else {
      this.error.confirm_password = "Password do not match"
    }
  }

}
