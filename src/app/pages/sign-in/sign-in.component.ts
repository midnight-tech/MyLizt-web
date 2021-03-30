import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  email = new FormControl("")
  password = new FormControl("")
  authService : AuthenticationService
  thisRoute : ActivatedRoute
  routes : Router

  constructor(auth : AuthenticationService,routes : Router,thisRoute : ActivatedRoute) {
    this.thisRoute = thisRoute
    this.routes = routes
    this.authService = auth
  }

  ngOnInit() {
  }

  navigateLogged(){
    this.routes.navigate(['/home'],{replaceUrl : true , relativeTo: this.thisRoute})
  }

  loginWithEmail() {
    this.authService.signIn(this.email.value,this.password.value).then(()=>{
      // Success
      this.navigateLogged()

    }).catch((error)=>{
      if(error == "User email is not verified."){
        this.routes.navigate(['/verification'])
      }
      this.email.setValue("")
      this.password.setValue("")
    })
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle().then(()=>{
      this.navigateLogged()
    }).catch((error)=>{
      this.email
    })
  }

  loginWithFacebook() {
    this.authService.signInWithFacebook().then(()=>{
      this.navigateLogged()
    }).catch((error)=>{

    })
  }

  loginWithTwitter() {
    this.authService.signInWithTwitter().then(()=>{
      this.navigateLogged()
    }).catch((error)=>{

    })
  }

  loginWithApple() {
    this.authService.signInWithApple().then(()=>{
      this.navigateLogged()
    }).catch((error)=>{
      
    })
  }

}
