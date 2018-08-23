var mongoose = require('mongoose');
var Restaurant = require('../models/restaurant');

mongoose.connect('mongodb://127.0.0.1:27017/garden', {useNewUrlParser: true});

var elements = {
    nameBranch: "BK Guápiles Norte",
    address: "Al norte we",
    telephone: "2710-1545"
};
/*
Restaurant.findOne({restName: 'Burger King'}, function(err, rest){
    if(err){
        throw err
    }
    var r = rest;
    r.branches.push({
        nameBranch: "BK Guápiles Sur",
        address: "Al sur we",
        telephone: "2710-1545"
    });
    r.save(function(err, rr){
        if (err) {
            console.log(err);
        }
    });
    exit();
});

*/

Restaurant.findOneAndUpdate({restName: 'Burger King'}, {$push:{branches: elements}}, function(err, rest){
    exit();
});

console.log("======================================");
Restaurant.findOne({restName: 'Burger King'}, function(err, rest){
    console.log(rest);
    exit();
});




/*
var done = 0;

for(var i = 0; i < elements.length; i++){
    elements[i].save(function(err, result){
        done++;
        if (done === elements.length) {
            exit();
        }
    });
}
*/

function exit(){
    mongoose.disconnect();
}