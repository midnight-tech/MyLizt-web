import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Parse from "parse"

@Injectable({
  providedIn: 'root'
})
export class ParseService {

  parse;

  constructor() {
    this.parse = Parse
    this.parse.serverURL = environment.serverURL
    this.parse.initialize(
      environment.ApplicationID, // This is your Application ID
      environment.JavascriptKey, // This is your Javascript key
    );
    // this.parse.enableEncryptedUser()
    this.parse.enableLocalDatastore()
    this.parse.User.enableUnsafeCurrentUser()
  }

}
