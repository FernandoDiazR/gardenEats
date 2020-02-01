var mongoose = require('mongoose');
var User = require('../models/user');
require('dotenv').config();

const db = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
}

const conString = `mongodb://${db.user}:${db.pass}@ds125892.mlab.com:${db.port}/${db.name}`
mongoose.connect(conString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

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