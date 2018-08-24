var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var Cart = require('../models/cart');
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

module.exports = router;