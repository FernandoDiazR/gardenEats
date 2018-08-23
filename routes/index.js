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

/*================================================================
==================================================================
*/

router.get('/:idRest/edit', function(req, res, next){
  Restaurant.findById(req.params.idRest, function(err, rest){
    if(err){
      throw err;
    }
    var branches = rest.branches;
    res.render('administrator/admRestaurant', {r: rest, branches: branches, noBranches: branches.length == 0});
  });
});

router.get('/:idRest/edit/add', function(req, res, next){
  var idr = req.params.idRest;
  Restaurant.findById(idr, function(err, rest){
    if(err){
      throw err;
    }
    res.render('administrator/addBranch', {rest: rest});
  });
});

router.post('/:idRest/edit/add', function(req, res, next){
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
      res.redirect('/'+idr+'/edit');
    }
  });
});

router.get('/:idRest/edit/:idBranch/sch', function(req, res, next){
  var idr = req.params.idRest;
  var idb = req.params.idBranch;
  Restaurant.findById(idr, function(err, rest){
    var branch = rest.branches.id(idb);
    res.render('administrator/admSchedule', {rest: rest, branch: branch})
  });
});

router.post('/:idRest/edit/:idBranch/sch', function(req, res, next){
  var d = req.body.DiasLab;
  var h = req.body.hora;
  var sch = {
    days: d,
    laboralTime: h
  }
  var idr = req.params.idRest;
  var idb = req.params.idBranch;
  Restaurant.findOneAndUpdate({'_id': idr, 'branches._id': idb},{$set:{'branches.$.schedule': sch}}, function(err, rest){
    if(err){
      throw err;
    } else{
      res.redirect('/'+idr+'/edit')
    }
  });
});

router.get('/:idRest/edit/:idBranch/prod', function(req, res, next){
  var errors = req.flash('error');
  var hasErrors = errors.length > 0;
  Restaurant.findById(req.params.idRest, function(err, rest){
    if(err){
      throw err;
    } else{
      var branch = rest.branches.id(req.params.idBranch);
      //var products = branch.products;
      var noProducts = (branch.products.length == 0);
      res.render('administrator/admProducts', {rest: rest, branch: branch, noProducts: noProducts, hasErrors: hasErrors, errors: errors});
    }
  });
});

router.get('/:idRest/edit/:idBranch/prod/add', function(req, res, next){
  var errors = req.flash('error');
  var hasErrors = errors.length > 0;
  var idb = req.params.idBranch;
  Restaurant.findById(req.params.idRest, function(err, rest){
    if(err){
      throw err;
    }else{
      var branch = rest.branches.id(idb);
      res.render('administrator/addProduct', {rest: rest, branch: branch, hasErrors: hasErrors, errors: errors});
    }
  })
});

router.post('/:idRest/edit/:idBranch/prod/add', function(req, res, next){
  var idr = req.params.idRest;
  var idb = req.params.idBranch;

  req.checkBody('nameproduc', 'Proporcione un nombre para el producto.').notEmpty();
  req.checkBody({
    'precio': {
      optional: {
        options: { checkFalsy: false }
      },
      isLength: {
        errorMessage: 'Proporcione un precio válido para el producto.',
        options: { min: 1 }
      },
      isDecimal: {
        errorMessage: 'Proporcione un precio válido para el producto.'
      }
    }
  });
  var errors = req.validationErrors();
  console.log(errors);
  if(errors){
      var allMessages = [];
      errors.forEach(function(error){
        allMessages.push(error.msg);
      });
      var messages = allMessages.filter(function(value, index, self){
        return self.indexOf(value) === index;
      });
      req.flash('error', messages);
      res.redirect('/'+idr+'/edit/'+idb+'/prod/add');
  } else{

    var name = req.body.nameproduc;
    var price = req.body.precio;
    var desc = req.body.Descripcion;

    var product = {
      nameProduct: name,
      priceProduct: price,
      descriptionProduct: desc
    }
    Restaurant.findOneAndUpdate({'_id': idr, 'branches._id': idb}, {$push:{'branches.$.products': product}}, function(err, rest){
      if(err){
        req.flash('error', 'Hubo un error al agregar el producto');
        res.redirect('/'+idr+'/edit/'+idb+'/prod');
      }else{
        res.redirect('/'+idr+'/edit/'+idb+'/prod');
      }
    });
  }
});

module.exports = router;