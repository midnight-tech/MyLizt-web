import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ParseService } from '../parse/parse.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  parseService: ParseService
  isLogged : boolean

  constructor(parse: ParseService) {
    this.parseService = parse
    let currentUser = this.parseService.parse.User.current()
    if(currentUser){
      this.isLogged = true
      console.log(currentUser)
    }
    this.isLogged = false
  }

  async signIn(email: string, password: string) {
    try {
      await this.parseService.parse.User.logIn(email,password)
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
      await user.signUp()
    } catch (e) {
      if (environment.production == false) {
        console.error(e)
      }
      throw "Erro ao criar conta"
    }
  }

  logout() {
    this.parseService.parse.User.logOut()
  }

}
