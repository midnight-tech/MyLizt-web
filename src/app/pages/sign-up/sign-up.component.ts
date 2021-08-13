import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';
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
export class SignUpComponent implements OnInit, AfterViewInit {

  username = new FormControl("")
  email = new FormControl("")
  password = new FormControl("")
  confirm_password = new FormControl("")

  @ViewChild("popUpSignUp") popUpMenu?: PopUpComponent;


  constructor(private authService: AuthenticationService, private router: Router) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
  }

  register() {
    if (this.username.value.length >= 30) {
      this.popUpMenu?.showPopUp("Field Username has too many caracters")
      return
    }
    if (this.username.value.length == 0) {
      this.popUpMenu?.showPopUp("Field Username can not be empty")
      return
    }
    if (this.password.value == this.confirm_password.value) {
      this.authService.signUpWithEmail(this.username.value, this.email.value, this.password.value).then(() => {
      }).catch((erro) => {
        switch (erro.code) {
          case 'auth/weak-password':
          case 'auth/email-already-in-use':
            this.popUpMenu?.showPopUp(erro.message)
            break
          case 'auth/invalid-email':
            this.popUpMenu?.showPopUp(erro.message)
            break
        }
      })
    } else {
      this.popUpMenu?.showPopUp("Password do not match")
    }
  }

}
