const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { logError, logWarn, log } = require('../log');
const { UsersMongoModel } = require('../models/db/mongoUsers.js')

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
}, function(req, username, password, done) {
    UsersMongoModel.findOne({ username }, (err, user) => {
        if (err) return done(err)

        if (!user) {
            logError.error('could not find the user');
            return done(null, false);
        }

        if (password !== user.password) {
            logWarn.warn('invalid password');
            return done(null, false)
        }

        return done(null, user)
    })
}))

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true,
},  function (req, email, password, done) {
        UsersMongoModel.findOne({ 'email': email }, function (err, user) { //adapt to new user model (email)

            if (err) {
                logError.error('Error in SignUp: ' + err);
                return done(err);
            }
        
            if (user) {
                logError.error('User already exists');
                return done(null, false)
            }
        
            const newUser = {
                email: email, 
                password: password,
                realname: req.body.realname,
                address: req.body.address,
                age: parseInt(req.body.age),
                phone: parseInt(req.body.phone),
                photo: req.body.photo 
            };

            log.info(req.body)

            UsersMongoModel.create(newUser, (err) => {
                if (err) {
                    logError.error('Error in Saving user: ' + err);
                    return done(err);
                }
                console.log('User Registration succesful');
                return done(null, newUser);
            })
        });   
    })
)

passport.serializeUser(function(user, done) {
    log.info(user);
    done(null, user.email);
});
  
  passport.deserializeUser(function(username, done) {
    log.info(username);
    let usuario = username;
    done(null, usuario);
})

 const checkAuthentication = (req, res, done) => {
     if(req.isAuthenticated()) {
        log.info('user is authorized')
        done();
    }
    else {
        logWarn.warn('log in required')
        res.redirect('/users/login');
    } 
}



module.exports = { checkAuthentication }