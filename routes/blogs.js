const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

//index route
router.get('/', (req, res) => {
    Blog.find({}, (err, data) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Some error occured. Please try again later.');
            res.redirect('back');
        }
        res.render('blogs/index', { data: data });
    });
});
//new route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('blogs/new');
});
//show route
router.get('/:id', (req, res) => {
    Blog.findById(req.params.id)
        .populate('comments')
        .populate('author')
        .exec((err, foundBlog) => {
            if (err) console.log(err);
            res.render('blogs/show', { blog: foundBlog });
        });
});
//edit route
router.get('/:id/edit', isOwner, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err);
            return res.redirect('/blogs/' + req.params.id);
        }
        res.render('blogs/update', { blog: foundBlog });
    });
});

//create route
router.post('/', isLoggedIn, (req, res) => {
    const newPost = req.body;
    newPost.author = req.user._id;
    Blog.create(newPost, (err, createdBlog) => {
        if (err) {
            req.flash('error', 'Something went wrong. Please try again later');
            console.log(err);
            res.redirect('back');
        }
        console.log(createdBlog);
        req.flash('success', 'Added Blog Successfully');
        res.redirect('/blogs');
    });
});
//update route
router.put('/:id', isOwner, (req, res) => {
    Blog.findByIdAndUpdate(
        req.params.id,
        req.body.newBlog,
        (err, updatedBlog) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Something went wrong. Please try again');
                return res.redirect('/blogs/' + req.params.id + '/edit');
            }
            req.flash('success', 'Updated Blog Successfully!');
            res.redirect('/blogs/' + req.params.id);
        }
    );
});
//delete route
router.delete('/:id', isOwner, (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Something went wrong. Please try again');
            return res.redirect('/blogs/' + req.params.id);
        }
        req.flash('success', 'Deleted Blog.');
        res.redirect('/blogs');
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please Login First.');
    res.redirect('/login');
}
async function isOwner(req, res, next) {
    //check if logged in
    //find that blog in db
    //check the author with current user
    //if same, allow to pass
    //if not same, give error
    if (req.isAuthenticated()) {
        try {
            let foundBlog = await Blog.findById(req.params.id);
            if (foundBlog.author.equals(req.user._id)) {
                return next();
            } else {
                req.flash('error', 'NOT AUTHORISED');
                res.redirect('back');
            }
        } catch (err) {
            req.flash('error', err.message);
            console.log(err);
            res.redirect('back');
        }
    } else {
        req.flash('error', 'Please Login First');
        console.log('Not logged in');
        res.redirect('/login');
    }
}

module.exports = router;
