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

var newUser = new User(administrator);

newUser.save(function(err, user){
    if(err) throw err;
    console.log("¡Usuario Administrador creado con éxito!");
    console.log("Nombre de usuario: " + user.username);
    console.log('Contraseña: ' + user.password);
    exit();
});

function exit(){
    mongoose.disconnect();
}