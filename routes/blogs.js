const User = require('../models/user'); //Import User Model Schema..
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken'); // compact, URL-safe means of represnting claims to be transferred bwtween to parties
const config = require('../config/database');

module.exports = (router) => {

    router.post('/newBlog', (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'blog title is required' });
        } else {
            if (!req.body.body) {
                res.json({ success: false, message: 'Blog body is requierd' });
            } else {
                if (!req.body.createdBy) {
                    res.json({ success: false, message: 'Blog Creater is requierd' });
                } else {
                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    });
                    blog.save((err) => {
                        if (err) {
                            if (err.errors) {
                                if (err.errors.title) {
                                    res.json({ success: false, message: err.errors.title.message });
                                } else {
                                    if (err.errors.body) {
                                        res.json({ success: false, message: err.errors.body.message });
                                    } else {
                                        res.json({ success: false, message: err.errmsg });
                                    }
                                }
                            } else {
                                res.json({ success: false, message: err });
                            }
                        } else {
                            res.json({ success: true, message: 'Blog Saved!' });
                        }
                    })
                }
            }
        }
    });

    router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err, blogs) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!blogs) {
                    res.json({ success: false, message: 'No blogs Found.' })
                } else {
                    res.json({ success: true, blogs: blogs });
                }
            }
        }).sort({ '_id': -1 });
    })

    router.get('/singleBlog/:id', (req, res) => {

        if (!req.params.id) {
            res.json({ success: false, message: 'No blog id provided' });
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Not a valid Blog id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog id was not found' });
                    } else {

                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable authenticated user' });
                                } else {
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: 'You are not autheticated to edit this blog' });
                                    } else {
                                        res.json({ success: true, blog: blog });

                                    }
                                }
                            }
                        })

                    }
                }
            })
        }

    });

    router.put('/updateBlog', (req, res) => {
        if (!req.body._id) {
            res.json({ success: false, message: 'No blog id Provided' });
        } else {
            Blog.findOne({ _id: req.body._id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Not a vliad blog id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Bold id was not found.' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unabel to authenticet user.' });
                                } else {
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to edit this blog post.' });
                                    } else {
                                        blog.title = req.body.title;
                                        blog.body = req.body.body;
                                        blog.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: err });
                                            } else {
                                                res.json({ success: true, message: 'Blog Updated!' });
                                            }
                                        });
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    })

    router.delete('/deleteBlog/:id', (req, res) => {
        if(!req.params.id){
            res.json({success: false, message: 'No id Provided'});
        }else{
            Blog.findOne({_id: req.params.id}, (err, blog) => {
                if(err){
                    res.json({success: false, message: 'Invalid id'});
                }else{
                    if(!blog){
                        res.json({success: false,message: 'Id Was not found'});
                    }else{
                        User.findOne({_id: req.decoded.userId}, (err, user) => {
                            if(err){
                                res.json({success: false,  message: err});
                            }else{
                                if(!user){
                                    res.json({success: false, message:'Unable to authenticated user.'});
                                }else{
                                    if(user.username !== blog.createdBy){
                                        res.json({success: false, message: 'You are not authorized to delete this blog post.'});
                                    }else{
                                        blog.remove((err) =>{
                                            if(err){
                                                res.json({success: false,message:err});
                                            }else{
                                                res.json({success: true, message: 'Blog deleted' });
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    });


    router.put('/likeBlog',(req, res) =>{
        if(!req.body.id){
            res.json({success: false, message: ' No id was provided'});
        }else{
            Blog.findOne({_id:req.body.id},(err,blog) => {
                if(err){
                    res.json({success: false, message: 'Invalid blog id'});
                }else{
                    if(!blog){
                        res.json({success: false, message: 'That blog was not found'});
                    }else{
                        User.findOne({_id: req.decoded.userId},(err,user) => {
                            if(err){
                                res.json({success: false,message:'somthing wat to wrong'});
                            }else{
                                if(!user){
                                    res.json({success: false, message: 'Could not authenticate user.'});
                                }else{
                                    if(user.username === blog.createdBy){
                                        res.json({success: false, message: 'Canno like your own post'});
                                    }else{
                                        if(blog.likesBy.includes(user.username)){
                                            res.json({success: false, message: 'You already liked this post'});
                                        }else{
                                            if(blog.dislikesBy.includes(user.username)){
                                                blog.dislikes--;
                                                const arrayIndex = blog.dislikesBy.indexOf(user.username);
                                                blog.dislikesBy.splice(arrayIndex,1);
                                                blog.likes++;
                                                blog.likesBy.push(user.username);
                                                blog.save((err) =>{
                                                    if(err){
                                                        res.json({success: false,message: 'Somthing went wrong'});
                                                    }else{
                                                        res.json({success: true, message: 'Blog liked'})
                                                    }
                                                })
                                            }else{
                                                blog.likes++;
                                                blog.likesBy.push(user.username);
                                                blog.save((err) =>{
                                                    if(err){
                                                        res.json({success: false,message: 'Somthing went wrong'});
                                                    }else{
                                                        res.json({success: true, message: 'Blog liked'})
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                        })   
                    }
                }
            })
        }
    });

    router.put('/dislikeBlog',(req, res) =>{
        if(!req.body.id){
            res.json({success: false, message: ' No id was provided'});
        }else{
            Blog.findOne({_id:req.body.id},(err,blog) => {
                if(err){
                    res.json({success: false, message: 'Invalid blog id'});
                }else{
                    if(!blog){
                        res.json({success: false, message: 'That blog was not found'});
                    }else{
                        User.findOne({_id: req.decoded.userId},(err,user) => {
                            if(err){
                                res.json({success: false,message:'somthing wat to wrong'});
                            }else{
                                if(!user){
                                    res.json({success: false, message: 'Could not authenticate user.'});
                                }else{
                                    if(user.username === blog.createdBy){
                                        res.json({success: false, message: 'Cannot dislike your own post'});
                                    }else{
                                        if(blog.dislikesBy.includes(user.username)){
                                            res.json({success: false, message: 'You already disliked this post'});
                                        }else{
                                            if(blog.likesBy.includes(user.username)){
                                                blog.likes--;
                                                const arrayIndex = blog.likesBy.indexOf(user.username);
                                                blog.likesBy.splice(arrayIndex,1);
                                                blog.dislikes++;
                                                blog.dislikesBy.push(user.username);
                                                blog.save((err) =>{
                                                    if(err){
                                                        res.json({success: false,message: 'Somthing went wrong'});
                                                    }else{
                                                        res.json({success: true, message: 'Blog disliked'})
                                                    }
                                                })
                                            }else{
                                                blog.dislikes++;
                                                blog.dislikesBy.push(user.username);
                                                blog.save((err) =>{
                                                    if(err){
                                                        res.json({success: false,message: 'Somthing went wrong'});
                                                    }else{
                                                        res.json({success: true, message: 'Blog disliked'})
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                        })   
                    }
                }
            })
        }
    });

    router.post('/comment',(req,res) => {
        if(!req.body.comment){
            res.json({success: false, message:'No comment provided'});
        }else{
            if(!req.body.id){
                res.json({success: false,message:'No id was proviede'});
            }else{
                Blog.findOne({_id: req.body.id},(err,blog) => {
                    if(err){
                        res.json({success: false, message: 'Invalid blog id'});
                    }else{
                        if(!blog){
                            res.json({success: false, message: 'Blog not Found.'});
                        }else{
                            User.findOne({_id: req.decoded.userId}, (err, user) => {
                                if(err){
                                    res.json({success: false, message: 'Somthing went to wrong'});
                                }else{
                                    if(!user){
                                        res.json({success: false, message:'user not found.'});
                                    }else{
                                        blog.comments.push({
                                            comment: req.body.comment,
                                            commentator: user.username
                                        });
                                        blog.save((err) =>{
                                            if(err){
                                                res.json({success: false, message: 'Somthing went wrong'});
                                            }else{
                                                res.json({success: true, message:'Comment Saved!'});
                                            }
                                        });
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    });

    return router;
}
