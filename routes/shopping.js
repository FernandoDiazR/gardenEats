var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
    var products = [];
    Restaurant.find({}, function(err, rests){
        if(err){
            return res.render('shop/shop');
        }
        rests.forEach(rest => {
            rest.branches.forEach(function(branch){
                if(branch.products.length > 0){
                    branch.products.forEach( prod => {
                        products.push({
                            _id: prod._id,
                            _idr: rest._id,
                            _idb: branch._id,
                            restName: rest.restName,
                            branchName: branch.nameBranch,
                            nameProduct: prod.nameProduct,
                            priceProduct: prod.priceProduct,
                            descriptionProduct: prod.descriptionProduct
                        });
                    });
                }
            });
        });
        res.render('shop/shop', {products: products, noProducts: products.length == 0});
    });
});

router.get('/add-to-cart/:idProd/:idRest/:idBranch', function(req, res, next){
    var idp = req.params.idProd;
    var idr = req.params.idRest;
    var idb = req.params.idBranch;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Restaurant.findOne({'_id': idr, 'branches._id': idb}, function(err, rest){
        if(err){
            return res.redirect('/shop');
        }
        var branch = rest.branches.id(idb);
        var preProd = rest.branches.id(idb).products.id(idp);
        var product = {
            _id: preProd._id,
            _idr: idr,
            _idb: idb,
            restName: rest.restName,
            branchName: branch.nameBranch,
            nameProduct: preProd.nameProduct,
            priceProduct: preProd.priceProduct,
            descriptionProduct: preProd.descriptionProduct
        }
        cart.add(product, product._id);
        req.session.cart = cart;
        res.redirect('/shop');
    });
});

module.exports = router;