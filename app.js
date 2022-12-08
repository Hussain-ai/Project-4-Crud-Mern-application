const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const blogRoutes = require('./routes/blogs');
const indexRoutes = require('./routes/index');
const LocalStrategy = require('passport-local');
const ExpressSession = require('express-session');
const methodOverride = require('method-override');
const commentRoutes = require('./routes/comments');
const expressSanitizer = require('express-sanitizer')
require('dotenv').config()

//CONECTING DB// APP CONFI
mongoose.connect('mongodb+srv://Hussain:hussain@cluster0.rk6qjyn.mongodb.net/bookblogwebsite?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false
  });

//passport setup
app.use(
  ExpressSession({
      secret: 'This is the bookblogify app',
      resave: false,
      saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(methodOverride('_method'))
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errorMessage = req.flash('error');
    res.locals.successMessage = req.flash('success');
    next();
});

// express.static(root, [options])
const path = require('path')
app.use( express.static(path.join(__dirname, 'public')))

app.listen(3500, (req, res) => {
  console.log('The server is up and running on port 3500')
});

//SCHEMA
let bookblogSchema = mongoose.Schema({
    title: String,
    image: {
        type: String,
        default: 'imagePlaceholder.jpg' 
    },
    author: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

//MODEL

let BookBlog = mongoose.model('BookBlog', bookblogSchema)

//RESTFUL ROUTES
app.get('/', (req, res) => {
    res.redirect('/bookblogs')
})

//below are new routes
app.get('/shop', (req, res) => {
  res.render('shop/shop.ejs')
})
app.get('/cart', (req, res) => {
  res.render('cart/cart.ejs')
})
app.get('/tictactoe', (req, res) => {
  res.render('tictactoe/tictactoe.ejs')
})
app.get('/connectfour', (req, res) => {
    res.render('connectfour/connectfour.ejs')
})
app.get('/snakegame', (req, res) => {
    res.render('snakegame/snakegame.ejs')
})
app.get('/pong', (req, res) => {
    res.render('pong/pong.ejs')
})
app.get('/carrace', (req, res) => {
    res.render('carrace/carrace.ejs')
})
app.get('/login', (req, res) => {
    res.render('auth/login.ejs')
})
app.get('/signup', (req, res) => {
    res.render('auth/signup.ejs')
})
app.get('/aboutus', (req, res) => {
  res.render('aboutus/aboutus.ejs')
})

//INDEX ROUTES

app.get('/bookblogs', (req, res) => {
    //RETRIEVING ALL BLOGS
    BookBlog.find({}, (error, bookblogs) => {
      if(error){
          console.log(error);
      }else{
        res.render('index', {bookblogs: bookblogs})
      }
    })
})

//NEW ROUTE
app.get('/bookblogs/new', (req, res) => {
    res.render('new.ejs')
})


//CREATE
app.post('/bookblogs', (req, res) => {
    //create bookblog
    BookBlog.create(req.body.bookblog, (error, newBookBlog) => {
      if(error){
          res.render('new')
      }else{
           //redirect to index page
          res.redirect('/bookblogs')
      }
    }) 
})

//ShOW ROUTE
app.get('/bookblogs/:id', (req, res) => {
    BookBlog.findById(req.params.id, (error, foundBookBlog) => {
      if(error){
        res.redirect('/bookblogs')
      }else{
        res.render('show', {bookblog:foundBookBlog})
      }
    })
});

//EDIT
app.get('/bookblogs/:id/edit', (req, res) => {
  BookBlog.findById(req.params.id, (error, foundBookBlog)=>{
    if(error){
      res.redirect('/bookblogs')
    }else {
      res.render('edit', {bookblog:foundBookBlog})
    }
  })
});


//UPDATE ROUTE
app.put('/bookblogs/:id', (req, res) => {
  BookBlog.findByIdAndUpdate(req.params.id, req.body.bookblog, (error, updatedBookBlog)=> {
    if(error) {
      res.redirect('/bookblogs')
    }else{
      res.redirect('/bookblogs/' + req.params.id)
    }
  })
});


//DELETE ROUTE
app.delete('/bookblogs/:id', (req, res) =>{
  //DESTROY BLOG
  BookBlog.findByIdAndRemove(req.params.id, (error)=> {
    if(error){
      res.redirect('/bookblogs')
    }else{
      res.redirect('/bookblogs')
    }
  })
});

//routes for General bookblogs
app.use('/blogs', blogRoutes);
app.use('/blogs/:id/comments', commentRoutes);
app.use('', indexRoutes);
