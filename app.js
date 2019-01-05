var express = require('express'),
app         = express(),
expressSanitizer = require('express-sanitizer');
methodOverride = require('method-override'),
bodyParser  = require('body-parser'),
mongoose    = require('mongoose');

// APP CONFIG
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
mongoose.connect('mongodb://127.0.0.1:27017/restful_blog_app', {useNewUrlParser: true});

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTS
app.get('/', function(req,res){
  res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', function(req,res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});


// NEW ROUTE
app.get('/blogs/new', function(req,res){
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function(req,res){
  // Create blogPost
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      console.log(err);
    } else {
      // then, redirect to blogs page
      res.redirect('/blogs');
    }
  });
  // Redirect to Blogs (index)
});

// SHOW ROUTE
app.get('/blogs/:id', function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      res.render('show', {blog:foundBlog});
    }
  });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', function(req,res){
  // Find the blog post via it's ID
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect('/blogs')
    } else {
      res.render('edit', {blog: foundBlog});
    }
  });
});

// UPDATE ROUTE
app.put('/blogs/:id', function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  var newData = req.body.blog,
  id          = req.params.id;
  Blog.findByIdAndUpdate(id, newData, function(err, updatedBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/'+req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete('/blogs/:id', function(req,res){
  var id = req.params.id;
  // Destroy blog post 
  Blog.findByIdAndRemove(id, function(err){
    if(err){
      res.redirect('/blogs');
    } else{
      res.redirect('/blogs');
    }
  });
  // Redirect somewhere
});

// title
// image 
// body 
// created

app.listen('8080', function(){
  console.log('Server is listening on \"8080\"');
})