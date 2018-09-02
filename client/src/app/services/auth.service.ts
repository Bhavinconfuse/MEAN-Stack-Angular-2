import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  domain = "http://localhost:8080/";

  authToken;
  user;
  options;
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new HttpHeaderResponse({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    })

  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;

  }

  registerUser(user) {
    return this.http.post(this.domain + 'authentication/register', user)
      .pipe(map(res => {
        return res;
      }))
  }

  checkUsername(username) {
    return this.http.get(this.domain + 'authentication/checkUsername/' + username)
      .pipe(map(res => {
        return res;
      }))
  }

  checkEmail(email) {
    return this.http.get(this.domain + 'authentication/checkEmail/' + email)
      .pipe(map(res => {
        return res;
      }))
  }

  login(user) {
    return this.http.post(this.domain + 'authentication/login', user).pipe(map(res => {
      return res;
    }));
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user))
    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/profile', this.options)
      .pipe(map(res => {
        return res;
      }));
  }
  isLoggedIn() {
    // return this.jwtHelper.isTokenExpired();
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  getPublicProfile(username){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/publicProfile/' + username, this.options)
    .pipe(map(res => {
      return res;
    }))
  }
}

