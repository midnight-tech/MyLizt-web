import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  tela = 0;

  email = new FormControl()
  password = new FormControl()



  constructor(public authentication : AuthenticationService,public router : Router, public route: ActivatedRoute) {}

  logIn(){
    this.authentication.signIn(this.email.value,this.password.value)
  }

  logInGoogle(){
    this.authentication.signInWithGoogle()
  }
  logInFacebook(){
    this.authentication.signInWithFacebook()
  }

  logInTwitter(){
    this.authentication.signInWithTwitter()
  }

  logout(){
    this.authentication.logout()
  }

  routerFunc(){
    console.log(this.route)
    if(this.tela == 0){
      this.router.navigate(['cadastro'],{relativeTo: this.route})
      this.tela = 1
    } else {
      this.router.navigate(['..'],{relativeTo: this.route})
      this.tela = 0
    }
  }

  ngOnInit() {
  }

}
