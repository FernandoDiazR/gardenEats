var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    fullname: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, lowercase: true, trim: true},
    password: {type: String, required: true},
    level: {type: String, required: true},
    created: {type: Date, required: true, default: Date.now},
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);