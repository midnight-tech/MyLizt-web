import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UnloggedShieldService implements CanActivate{

  constructor(public auth: AuthenticationService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(this.auth.user)
    if (this.auth.isLogged == false) {
      return true
    }
    if(this.auth.authLoaded){
      this.router.navigate(['home'], { replaceUrl: true })
    }
    return false
  }

}
