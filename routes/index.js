var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Restaurant = require('../models/restaurant');

/* GET home page. */
router.get('/', function(req, res, next) {
  var loggedUser = req.user;
  if(!loggedUser){
    res.render('shop/index', { title: 'Garden Eats'});
  } else{
    User.findById({'_id': loggedUser._id}, function(err, user){
      if(err) throw err;
      res.render('shop/index', { title: 'Garden Eats', user: user });
    });
  }
});

router.get('/restaurants', function(req, res, next){
  Restaurant.find({}, function(err, rests){
    if(err) throw err;
    res.render('administrator/restaurants', {rests: rests, noRest: rests.length == 0});
  });
});

router.get('/addRestaurant', function(req, res, next){
  var errors = req.flash('error');
  res.render('administrator/restRegister', {errors: errors, hasErrors: errors.length > 0} );
});

router.post('/addRestaurant', function(req, res, next){
  var rest = req.body;
  Restaurant.findOne({'name': rest.name}, function(err, restaurant){
    if(err) throw err;
    if(restaurant){
      req.flash('error', 'Ya existe un restaurante con el nombre propuesto.');
      res.redirect('/addRestaurant');
    } else{
      var newRestaurant = new Restaurant(rest);
      newRestaurant.save(function(err, r){
        if(err){
          console.log(err);
          throw err;
        }
      });
      res.redirect('/restaurants');
    }
  });
});

module.exports = router;