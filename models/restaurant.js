var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*var timeScheduleSchema = new Schema({
    opening: String,
    closing: String,
    closed: {type:Boolean, required:true},
    fulltime: {type:Boolean, required: true}
});
*/
var scheduleSchema = new Schema({
    day: {type:String, required: true},
    schedule:{type: String, required: true}
});

var productsSchema = new Schema({
    nameProduct: { type: String,required: true },
    priceProduct: { type: Number, required: true },
    descriptionProduct: { type: String, requiered: true }
});

var BranchSchema = new Schema({
    nameBranch: { type: String, required: true },
    address: { type: String },
    telephone: { type: String },
    schedule:[scheduleSchema],
    products: [productsSchema]
})
var RestaurantSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    branches: [BranchSchema]
});

module.exports = mongoose.model('Restaurant',RestaurantSchema);