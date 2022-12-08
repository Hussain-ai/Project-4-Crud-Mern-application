const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/comment');
const Blog = require('../models/blog');

//new route
router.get('/new', isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            req.flash('error', 'Something went wrong');
            console.log(err);
            res.redirect('back');
        }
        res.render('comments/new', { blog: foundBlog });
    });
});
//create route
router.post('/', isLoggedIn, (req, res) => {
    req.body.author = req.user._id;
    req.body.authorName = req.user.username;
    Comment.create(req.body, (err, createdComment) => {
        if (err) {
            req.flash('error', 'Something went wrong');
            console.log(err);
            res.redirect('back');
        }
        Blog.findById(req.params.id, async (err, foundBlog) => {
            if (err) {
                req.flash('error', 'Something went wrong');
                console.log(err);
                res.redirect('back');
            }
            foundBlog.comments.push(createdComment);
            await foundBlog.save();
            req.flash('success', 'Added comment!');
            res.redirect('/blogs/' + req.params.id);
        });
    });
});
//delete route
router.delete('/:commentId', isOwner, (req, res) => {
    Comment.findByIdAndDelete(req.params.commentId, (err) => {
        if (err) {
            req.flash('error', 'Something went wrong');
            console.log(err);
            return res.redirect('/blogs/');
        }
        req.flash('success', 'Deleted comment successfully');
        res.redirect('/blogs/' + req.params.id);
    });
});

//middlewares
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login first');
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
            let foundComment = await Comment.findById(req.params.commentId);
            if (foundComment.author.equals(req.user._id)) {
                return next();
            } else {
                req.flash('error', 'NOT AUTHORISED');
                res.redirect('back');
            }
        } catch (err) {
            req.flash('error', 'Something went wrong');
            console.log(err);
            res.redirect('back');
        }
    } else {
        req.flash('error', 'Please login first');
        console.log('Not logged in');
        res.redirect('/login');
    }
}

module.exports = router;
