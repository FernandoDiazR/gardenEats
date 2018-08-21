var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next){
  
});

router.get('/signup', function(req, res, next){
  var errors = req.flash('error');
  if(errors.length > 0){
    res.render('user/register', { error: errors, hasError: errors.length > 0 });
  } else {
    res.render('user/register');
  }
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next){
  var username = req.body.username;
  res.redirect('/'+username);
});


router.get('/signin', function(req, res){
  var errors = req.flash('error');
  if(errors.length > 0){
    res.render('user/login', { error: errors, hasError: errors.length > 0 });
  } else {
    res.render('user/login');
  }
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next){
  var username = req.body.username;
  res.redirect('/'+username);
});

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

module.exports = router;
