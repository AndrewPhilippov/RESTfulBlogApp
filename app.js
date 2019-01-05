var express = require('express'),
app         = express(),
bodyParser  = require('body-parser'),
mongoose    = require('mongoose');

// APP CONFIG
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
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


// INDEX ROUTE
app.get('/blogs/new', function(req,res){
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function(req,res){
  // Create blogPost
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

// title
// image 
// body 
// created

app.listen('8080', function(){
  console.log('Server is listening on \"8080\"');
})