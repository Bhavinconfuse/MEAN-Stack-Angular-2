import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { BlogService} from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {


  messageClass;
  message;
  newPost = false;
  locadingBlogs =  false;
  form;
  commentForm;
  processing = false;
  username;
  blogPosts;
  newComment = [];
  enabledComments =[];


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) {

    this.createNewBlogForm();
    this.createCommentForm();

   }

  createNewBlogForm(){ //----------- !@ function
    this.form = this.formBuilder.group({
        title:['',Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5),
          this.alphaNumericValidation          
        ])],
        body: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(5)
        ])]
    });
  }

  enableCommetForm(){
    this.commentForm.get('comment').enable();
  }
  disablecommentForm(){
    this.commentForm.get('comment').disable();
  }

  enableFormNewBlogForm(){
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableFormNewBlogForm(){
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  alphaNumericValidation(controls){
    const regExp =  new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return {  'alphaNumericValidation' : true}
    }
  }

  newBlogForm(){ //----------- !@ function
    this.newPost = true;
  }

  reloadBlogs(){ //----------- !@ function
    this.locadingBlogs = true;
    this.getallBlogs();
    setTimeout(() => {
      this.locadingBlogs = false;
    },4000)
  }

  draftComment(id){ //----------- !@ function
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  onBlogSubmit(){
    this.processing = true;
    this.disableFormNewBlogForm();

    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    }

    this.blogService.newBlog(blog).subscribe((data : any ) => {
        if(!data.success){
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
          this.processing = false;
          this.enableFormNewBlogForm();
        }else{
          this.messageClass = 'alert alert-success';
          this.message =  data.message;
          this.getallBlogs();
          setTimeout(() => {
              this.newPost =  false;
              this.processing = false;
              this.message =  false;
              this.form.reset();
              this.enableFormNewBlogForm();
          }, 2000);
        }
    });
    
  }

  goBack(){
    window.location.reload();
  }

  getallBlogs(){
    this.blogService.getAllBlogs().subscribe((data : any) => {
      this.blogPosts = data.blogs;
    });
  }

  likeBlog(id){
    
    this.blogService.likeBlog(id).subscribe((data : any) => {
      this.getallBlogs();
    });
  }

  dislikeBlog(id){
    this.blogService.dislikeBlog(id).subscribe((data : any) => {
      this.getallBlogs();
    });
  }

  createCommentForm(){
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(1)
      ])]
    })
  }
  postComment(id){
    this.disablecommentForm();
    this.processing = true;
    const comment = this.commentForm.get('comment').value; // here chek value afer ()... ok
    // console.log(comment);
    this.blogService.postcomment(id, comment).subscribe((data : any) => {
      // console.log(data);
      this.getallBlogs();
      const index =  this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.enableCommetForm();
      this.commentForm.reset();
      this.processing =  false;
      if(this.enabledComments.indexOf(id) < 0) this.expand(id);
    })
  }
  expand(id){
    this.enabledComments.push(id);
  }
  collapse(id){
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  cancelSubmission(id){
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommetForm();
    this.processing = false;
  }
  ngOnInit() {
    this.authService.getProfile().subscribe((profile : any) => {
      console.log(profile);
      this.username = profile.user.username;
    });

    this.getallBlogs();
  }

}
