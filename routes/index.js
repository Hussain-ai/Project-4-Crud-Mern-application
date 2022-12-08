const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const passport = require('passport');

router.get('/', (req, res) => {
    Blog.find({}, (err, data) => {
        if (err) console.log(err);
        res.render('home', { data: data });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged out successfully');
    res.redirect('/blogs');
});

router.post('/register', (req, res) => {
    User.register(
        new User({ username: req.body.username, email: req.body.email }),
        req.body.password,
        (err, user) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Something went wrong. Please try again');
                return res.render('register');
            }
            passport.authenticate('local')(req, res, () => {
                req.flash('success', 'Welcome to Blogify,' + req.user.username);
                res.redirect('/blogs');
            });
        }
    );
});
router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/blogs',
        failureFlash: 'Could not login, try again.',
        successFlash: 'Welcome Back!',
    }),
    (req, res) => {}
);
module.exports = router;
