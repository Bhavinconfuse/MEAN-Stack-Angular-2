import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {


  message;
  messageClass;
  currentUrl;
  blog;
  processing =  false;
  loading =  true;


  constructor(
    private location: Location,
    private blogService: BlogService,
    private activetedRoute: ActivatedRoute,
    private router: Router
  ) { }


  updateBlogSubmit(){
    this.processing = true;
    // Function update blog
    this.blogService.editBlog(this.blog).subscribe((data :any) => {
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      }else{  
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/blog']);
        }, 2000);
      }
    });
  }
  goBack(){
    this.location.back();
  }
  ngOnInit() {
    this.currentUrl = this.activetedRoute.snapshot.params;
    // alert(this.currentUrl.id);
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe((data :any) => {
      console.log('edit blog data:-'+ data);
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = 'Blog Not Found';
      }else{
        alert(data.blog.title);
      this.blog = data.blog;
        this.loading = false;
      }

    });
  }

}
