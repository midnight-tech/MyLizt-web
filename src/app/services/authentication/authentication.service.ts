/// <reference path="../../../../node_modules/@types/gapi/index.d.ts">
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ParseService } from '../parse/parse.service';
// import "gapi"
// import  "gapi.auth2"


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {

  parseService: ParseService
  isLogged: boolean
  authInstance?: gapi.auth2.GoogleAuth

  constructor(parse: ParseService) {
    this.parseService = parse
    const userda = new parse.parse.User() 
    let currentUser = this.parseService.parse.User.current()
    console.log(currentUser, "current User")
    gapi.load('auth2', () => {
      gapi.auth2.init({ client_id: '62581502185-6pmgh1221evrbvfq98v1kgnpee8a596u.apps.googleusercontent.com' }).then((auth) => {
        this.authInstance = auth
      })
    })
    if (currentUser) {
      this.isLogged = true
      console.log(currentUser)
      return;
    }
    this.isLogged = false
  }

  canActivate() {
    if (this.parseService.parse.User.current()) {
      return true
    }
    return false
  }

  async signIn(email: string, password: string) {
    try {
      let user = await this.parseService.parse.User.logIn(email, password)
      console.log(user)
      this.isLogged = true
    } catch (e) {
      if (environment.production == false) {
        console.error(e, e.code)
      }
      // verificação caso usuario não tenha validado o email
      if (e.code == 205) {
        throw "User email is not verified."
      }

      // erros gerais
      throw "Erro ao autenticar"
    }
  }

  async signInWithGoogle() {
    let user = await this.authInstance!!.signIn()
    try {
      const userLog = await this.parseService.parse.User.logInWith("google", {
        authData: {
          id: user.getId(),
          id_token: user.getAuthResponse().id_token,
        }
      })
      userLog.set("username", user.getBasicProfile().getName)
      userLog.set("email", user.getBasicProfile().getEmail)
      userLog.save()

      console.log(userLog)
      this.isLogged = true
    } catch (e) {
      console.error(e)
    }
  }

  async signUpWithEmail(userName: string, email: string, password: string) {
    let user = new this.parseService.parse.User()
    user.setEmail(email)
    user.setPassword(password)
    user.setUsername(userName)
    try {
      let userInfo = await user.signUp()
    } catch (e) {
      if (environment.production == false) {
        console.error(e)
      }
      console.log(e)
      throw "Erro ao criar conta"
    }
  }

  async logout() {
    await this.parseService.parse.User.logOut()
    this.isLogged = false
  }

}
