var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');

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
  res.redirect('/');
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
  res.redirect('/');
});

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, function (req, res, next) {
  Order.find({user: req.user}, function(err, orders){
    if(err){
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {orders: orders})
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}