import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-register-example',
  templateUrl: './register-example.component.html',
  styleUrls: ['./register-example.component.scss']
})
export class RegisterExampleComponent implements OnInit {

  register = new FormGroup(
    {
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    }
  )

  constructor(public auth: AuthenticationService) {
    console.log(this.register.value.username)
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.register.value)
    if (this.register.value.password == this.register.value.confirmPassword) {
      this.auth.signUpWithEmail(this.register.value.username, this.register.value.email, this.register.value.password)
    }
  }

}
