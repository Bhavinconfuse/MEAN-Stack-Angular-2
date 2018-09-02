import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  messageClass;
  message;
  processing = false;
  form;
  PreviousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
    this.createForm();
  }


  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.login(user).subscribe((data: any) => {
      // @Check if response was a success or error.
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // @Set bootstrtap error class.
        this.message = data.message; // @Set error message.
        this.processing = false; // @Enable submit button.
        this.enableForm();  // @Enable form for Editing.
      } else {
        this.messageClass = 'alert alert-success';  // @Set bootstrap success class.
        this.message = data.message; // @Se success message.
        // @Function to store user's token in client local storage
        this.authService.storeUserData(data.token, data.user);
        // @After 2 second, redirect to dash board page.
        setTimeout(() => {
          if (this.PreviousUrl) {
            this.router.navigate([this.PreviousUrl]);
          } else {
            this.router.navigate(['/dashboard']); // @navigate to dashboard view.
          }
        }, 2000)
      }
    });
  }
  ngOnInit() {

    if (this.authGuard.redirectUrl) { // here "redirectURL" is part of auth gard check first authgard.!
      this.messageClass = 'alert alert-danger';
      this.message = 'You Must be logged in to view that page';
      this.PreviousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

}
