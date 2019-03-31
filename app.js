var express = require("express");
var bodyParser= require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var expressSanitizer = require('express-sanitizer');
var ejs= require("ejs");

var app = express(); //Express Setup
app.set("view engine","ejs");  //Setting up the view engine to ejs
app.use(express.static("public")); // Setting public directory for stylesheet and js files
app.use(bodyParser.urlencoded({ extended: true })); //Body Parser Setup
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Mongoose Setup
mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true });
var blogSchema = mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date,default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);
// Blog.create({
//    title: "test blog",
//    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2KgyBnsZzssBH6xWAtd_R8I9KRlk2Fa3v5Duiym4Bu_FF0qcdpg",
//    body: "This is only for test"
// });

//Routes

//Root Route
app.get("/",function(req, res) {
   res.redirect("/blogs"); 
});
//Index Routes
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
      if(err)
         console.log(err);
      else
         res.render("index",{blogs:blogs});
   });
});
//New Route
app.get("/blogs/new",function(req, res) {
    res.render("new");
});
//Create Route
app.post("/blogs",function(req,res){
   req.body.blog.body = req.sanitizer(req.body.blog.body);
   Blog.create(req.body.blog,function(err,newBlog){
      if(err){
         res.render("new");
      }
      else{
         res.redirect("/blogs");
      }
   });
});
//Show Route
app.get("/blogs/:id",function(req, res){
      Blog.findById(req.params.id,function(err,foundBlog){
         if(err)
            res.redirect("/blogs");
         else
            res.render("show",{blog:foundBlog})
      })
});
//EDIT Route
app.get("/blogs/:id/edit",function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
         if(err)
            res.redirect("/blogs");
         else
            res.render("edit",{blog:foundBlog})
      });
});
//Update Route
app.put("/blogs/:id",function(req,res){
      req.body.blog.body = req.sanitizer(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
      if(err)
            res.redirect("/blogs");
         else
            res.redirect("/blogs/req.params.id");
   });
});
//Delete Route
app.delete("/blogs/:id",function(req, res) {
   Blog.findByIdAndRemove(req.params.id,function(err){
      if(err)
         res.redirect("/blogs");
      else
         res.redirect("/blogs");
   }); 
});
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("server started");
});