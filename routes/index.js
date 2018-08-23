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
  Restaurant.findOne({'name': rest.restName}, function(err, restaurant){
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
//---------------------------------------------------------------
//---------------------------------------------------------------
router.get('/:idRest/edit', function(req, res, next){
  Restaurant.findById(req.params.idRest, function(err, rest){
    if(err){
      throw err;
    }
    res.render('shop/showRestaurant', {r: rest});
  });
});

router.get('/:idRest/edit/branches', function(req, res, next){
  Restaurant.findById(req.params.idRest, function(err, rest){
    if(err){
      throw err;
    } else{
      var branches = rest.branches;
      res.render('administrator/admBranches', {r: rest, branches: branches, noBranches: branches.length == 0});
    }
  });
});

router.get('/:idRest/edit/branches/add', function(req, res, next){
  var idr = req.params.idRest;
  Restaurant.findById(idr, function(err, rest){
    if(err){
      throw err;
    }
    res.render('administrator/addBranch', {rest: rest});
  });
});

router.post('/:idRest/edit/branches/add', function(req, res, next){
  var idr = req.params.idRest;
  var branch = {
    nameBranch: req.body.NomSucursal,
    address: req.body.Direccion,
    telephone: req.body.Telefono
  }
  Restaurant.findByIdAndUpdate(idr, {$push:{branches: branch}}, function(err, done){
    if(err){
      throw err;
    } else{
      res.redirect('/'+idr+'/edit/branches');
    }
  });
});

router.get('/:idRest/edit/branches/:idBranch/sch', function(req, res, next){
  var idr = req.params.idRest;
  var idb = req.params.idBranch;
  Restaurant.findById(idr, function(err, rest){
    var branch = rest.branches.id(idb);
    res.render('administrator/admSchedule', {rest: rest, branch: branch})
  });
});

module.exports = router;