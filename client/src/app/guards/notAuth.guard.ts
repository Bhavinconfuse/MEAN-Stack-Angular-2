import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ){}

  canActivate() {
    // console.log('AuthGuard#canActivate called');
    // return true;

    if(this.authService.isLoggedIn()){
        this.router.navigate(['/']);
        return false;
    }else{
        return true;
    }
  }
}