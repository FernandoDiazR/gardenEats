var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Restaurant = require('../models/restaurant');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('shop/shop');
});

module.exports = router;