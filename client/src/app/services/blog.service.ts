import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BlogService {


  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }


  
  createAuthenticationHeaders() {
    this.authService.loadToken();
    this.options = new HttpHeaderResponse({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    })

  }

  newBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'blogs/newBlog', blog, this.options)
    .pipe(map(res => {
      return res;
    }))
  }

  getAllBlogs(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/allBlogs', this.options)
    .pipe(map(res => {
      return res;
    }))
  }

  getSingleBlog(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/singleBlog/' + id, this.options)
    .pipe(map(res => {
      return res;
    }))
  }

  editBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'blogs/updateBlog/', blog, this.options)
    .pipe(map(res => {
      return res;
    }))
  }

  deleteBlog(id){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, this.options)
    .pipe(map(res => {
      return res;
    }));
  }


  likeBlog(id){
    const blogData =  { id: id};
    return this.http.put(this.domain + 'blogs/likeBlog/', blogData, this.options)
    .pipe(map(res => {
      console.log('blog Data:-'+ res);
      return res;
    }))
  }
  dislikeBlog(id){
    const blogData =  {id: id};
    return this.http.put(this.domain + 'blogs/dislikeBlog/', blogData, this.options)
    .pipe(map(res => {
      return res;
    }))
  }

  postcomment(id, comment){
    this.createAuthenticationHeaders();
    const blogData = {
      id: id,
      comment: comment
    }

    return this.http.post(this.domain + 'blogs/comment', blogData, this.options)
    .pipe(map(res => {
      // console.log("comment data:- "+res);
        return res;
    }));
  }
}
