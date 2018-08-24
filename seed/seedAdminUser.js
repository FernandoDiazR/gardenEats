var mongoose = require('mongoose');
var User = require('../models/user');

mongoose.connect('mongodb://127.0.0.1:27017/garden', {useNewUrlParser: true});

var administrator = {
    fullname: 'administrator',
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin',
    level: 'admin',
};

User.findOneAndRemove({'username': 'admin'}, function(err, res){
    if(err) throw err;
    exit();
});

var newUser = new User(administrator);
newUser.password = newUser.encryptPassword(administrator.password);
newUser.save(function(err, user){
    if(err) throw err;
    console.log("¡Usuario Administrador creado con éxito!");
    console.log("Nombre de usuario: " + administrator.username);
    console.log('Contraseña: ' + administrator.password);
    exit();
});



function exit(){
    mongoose.disconnect();
}