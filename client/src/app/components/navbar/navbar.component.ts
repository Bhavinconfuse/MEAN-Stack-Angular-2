import { Component, OnInit } from '@angular/core';
import { AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgFlashMessageService  } from 'ng-flash-messages';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authSevice: AuthService,
    private router: Router,
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  ngOnInit() {
  }

  onLogoutClick(){
    this.authSevice.logout();
    this.ngFlashMessageService.showFlashMessage({messages:['you have looged out'],type:'success'});
    this.router.navigate(['/']);
  }
}
