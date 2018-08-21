var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local');

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done){
    req.checkBody('email', 'Correo inválido.').notEmpty().isEmail();
    req.checkBody('password', 'Contraseña vacía o menor de 4 caracteres').notEmpty().isLength({min:4});
    req.checkBody('password', 'Contraseñas no coinciden.').equals(req.body.confPassword);
    var errors = req.validationErrors();
    
    if(errors){
        var allMessages = [];
        errors.forEach(function(error){
        allMessages.push(error.msg);
        });
        var messages = allMessages.filter(function(value, index, self){
        return self.indexOf(value) === index;
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'username': username}, function(err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Nombre de usuario ya está en uso.'});
        }
        var newUser = new User(req.body);
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, us){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done){
    req.checkBody('username', 'Favor no dejar campos vacíos.').notEmpty();
    req.checkBody('password', 'Favor no dejar campos vacíos.').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'username': username}, function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'Usuario no se encuentra registrado.'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Contraseña incorrecta.'});
        }
        return done(null, user);
    });
}));