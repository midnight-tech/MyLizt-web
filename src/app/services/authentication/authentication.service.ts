import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ParseService } from '../parse/parse.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {

  parseService: ParseService
  isLogged : boolean

  constructor(parse: ParseService) {
    this.parseService = parse
    let currentUser = this.parseService.parse.User.current()
    console.log(currentUser,"current User")
    if(currentUser){
      this.isLogged = true
      console.log(currentUser)
      return;
    }
    this.isLogged = false
  }

  canActivate(){
    if(this.parseService.parse.User.current()){
      return true
    }
    return false
  }

  async signIn(email: string, password: string) {
    try {
      let user = await this.parseService.parse.User.logIn(email,password)
      console.log(user)
      this.isLogged = true
    } catch (e) {
      if (environment.production == false) {
        console.error(e)
      }
      throw "Erro ao autenticar"
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
      throw "Erro ao criar conta"
    }
  }

  async logout() {
    await this.parseService.parse.User.logOut()
    this.isLogged = false
  }

}
