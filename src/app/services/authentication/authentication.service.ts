/// <reference path="../../../../node_modules/@types/gapi/index.d.ts">
/// <reference path="../../../../node_modules/@types/facebook-js-sdk/index.d.ts">
import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ParseService } from '../parse/parse.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {

  parseService: ParseService
  isLogged: boolean
  authInstance?: gapi.auth2.GoogleAuth
  user: Parse.User | null

  constructor(parse: ParseService, public fireAuth: AngularFireAuth) {
    this.parseService = parse
    let currentUser = this.parseService.parse.User.current()
    console.log(currentUser, "current User")
    gapi.load('auth2', () => {
      gapi.auth2.init({ client_id: '62581502185-6pmgh1221evrbvfq98v1kgnpee8a596u.apps.googleusercontent.com' }).then((auth) => {
        this.authInstance = auth
      })
    })
    console.log(window, 'widonasdad')
    if (currentUser) {
      this.isLogged = true
      console.log(currentUser)
      this.user = currentUser
      return;
    }
    this.isLogged = false
    this.user = null
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
      this.user = user
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
      const newUser = new this.parseService.parse.User()
      newUser.setUsername(user.getBasicProfile().getName())
      newUser.setEmail(user.getBasicProfile().getEmail())
      await newUser.linkWith("google", {
        authData: {
          id: user.getId(),
          id_token: user.getAuthResponse().id_token,
        }
      })
      // console.log(userLog)
      this.user = newUser
      this.isLogged = true
    } catch (e) {
      console.error(e)
    }
  }

  async signInWithFacebook() {
    FB.login((response) => {
      console.log(response)
      FB.api('/me', { fields: 'email,name' }, async (userData: any) => {
        console.log(FB)
        const newUser = new this.parseService.parse.User()
        console.log(userData)
        newUser.setUsername(userData.name)
        newUser.setEmail(userData.email)
        await newUser.linkWith("facebook", {
          authData: {
            id: response.authResponse.userID,
            access_token: response.authResponse.accessToken,
          }
        })
        this.user = newUser
        this.isLogged = true
      })
    }, {
      return_scopes: true,
      scope: "email"
    })
  }

  async signInWithTwitter() {
    const user = await this.fireAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
    console.log(user,'tUser')
    const newUser = new this.parseService.parse.User()
    newUser.setUsername(user.user!!.displayName!!)
    newUser.setEmail(user.user?.email!!)
    await newUser.linkWith("twitter", {
      authData: {
        // @ts-ignore
        id: user.additionalUserInfo?.profile.id_str,
        // @ts-ignore
        auth_token: user.credential.accessToken,
        // @ts-ignore
        auth_token_secret : user.credential.secret
      }
    })
    this.user = newUser
    this.isLogged = true
    console.log(user)
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
    this.user = null
    this.isLogged = false
  }

}
