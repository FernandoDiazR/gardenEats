var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/index', { title: 'Garden Eats'});
});

router.get('/:username', function(req, res, next){
  User.findOne({'username': req.params.username}, function(err, user){
    if(err) throw err;
    res.render('shop/index', { title: 'Garden Eats', user: user });
  });
});

module.exports = router;