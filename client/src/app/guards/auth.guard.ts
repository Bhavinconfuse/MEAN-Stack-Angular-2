import { Injectable }     from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, }    from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    redirectUrl;

    constructor(
        private authService: AuthService,
        private router: Router
    ){}

  canActivate(
      router: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ) {
    // console.log('AuthGuard#canActivate called');
    // return true;

    if(this.authService.isLoggedIn()){
        return true;
    }else{
        this.redirectUrl = state.url;
        this.router.navigate(['/login']);
        return false;
    }
  }
}