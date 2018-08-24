var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var Cart = require('../models/cart');
var Order = require('../models/order');
/* GET home page. */

router.get('/', function(req, res, next){
    if(!req.session.cart){
        return res.render('shop/cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/remove/:id', function(req,res, next){
    var idp = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(idp);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/reduce/:id', function(req, res, next){
    var idp = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(idp);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/checkout', function(req, res, next){
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg});
});

router.post('/checkout', function(req, res, next){
    req.checkBody('numtarje', 'Todos los campos tienen que ser llenados correctamente').notEmpty();
    req.checkBody('name', 'Todos los campos tienen que ser llenados correctamente').notEmpty();
    req.checkBody('expira', 'Todos los campos tienen que ser llenados correctamente').notEmpty();
    req.checkBody('csc', 'Todos los campos tienen que ser llenados correctamente').notEmpty().isLength({max: 3});
    var errors = req.validationErrors();
    if(errors){
        var allMessages = [];
        errors.forEach(function(error){
            allMessages.push(error.msg);
        });
        var messages = allMessages.filter(function(value, index, self){
            return self.indexOf(value) === index;
        });
        req.flash('error', messages);
        return res.redirect('/shopping-cart/checkout');
    }else{
        if(!req.session.cart){
            req.flash('error', err.messages);
            return res.redirect('/shopping-cart');
        }
        var cart = new Cart(req.session.cart);
        var order = new Order({
            user: req.user,
            cart: cart,
            name: req.body.name
          });
        order.save(function(err, result){
            req.flash('success', '¡Compra realizada con éxito!');
            req.session.cart = null;
            res.redirect('/');
        });
    };
});

module.exports = router;