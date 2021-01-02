var express = require('express');
var router = express.Router();

let User = require('../models/user');

var sessionChecker = (req, res, next) => {
    if(req.session.user && req.cookies.user_sid) {
        res.redirect('/home');
    } else {
        next();
    }
};
/* GET home page. */
router.get('/',sessionChecker, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/',sessionChecker, function(req, res, next) {
    const { username, password } = req.body;
    console.log(1);
    User.findOne({ username:req.body.username })
        .then(user => {
            if (!user) {
                res.redirect('/');
            } else if (user.password != password) {
                res.redirect('/');
            } else {
                req.session.user = user;
                res.redirect('/home');
            }
        })
        .catch();
  });

router.get('/home', function(req, res, next) {
    if(req.session.user && req.cookies.user_sid) {
        res.render('home', { title: 'Home' });
    } else {
        res.redirect('/');
    }
  });

router.get('/signup', sessionChecker, function(req, res, next) {
    res.render('signup', { title: 'signup' });
});

router.post('/signup', sessionChecker, function(req, res, next) {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then((user) => {
        req.session.user = user;
        res.redirect('/home');
    })
    .catch((err) => {
        res.redirect('/signup');
    });
});

// route for user logout
router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

module.exports = router;
