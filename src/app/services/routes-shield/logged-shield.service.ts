import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedShieldService implements CanActivate {

  constructor(public auth: AuthenticationService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(this.auth.isLogged)
    if (this.auth.isLogged) {
      return true
    }
    if(this.auth.authLoaded){
      this.router.navigate(['/signin'], { replaceUrl: true })
    }
    return false
  }
}