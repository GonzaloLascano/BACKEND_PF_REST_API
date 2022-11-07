const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { logError, logWarn, log } = require('../../config/log.js');
const { TWILIO } = require('../../config/config.js')
const { sndWhatsappMessage } = require('../../config/twilioConfig')
const { sendMail } = require('../../config/nodemailerConfig.js')
const { UsersMongoModel } = require('../models/usersModel.js')
const { chartMaker } = require('../services/chartServices.js')
const { createHash, passwordValidation } = require('./utils')

 
// ------------------- P A S S P O R T  --------------------------- 

//Serializing User----------------------------------------------------------
passport.serializeUser((user, done) => {
    log.info(user + "logged in")
    done(null, user._id);
});
  
  passport.deserializeUser(async (id, done) => {
    log.info(id + " deserializing");
    try{
        let user = await UsersMongoModel.findById(id);
        done(null, user);
    } catch(err){
        logError.error(err)
        done(err, false)
    }
})

// Login Local Strategy-----------------------------------------------------
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
},  async function(req, email, password, done) {
    let user
    try{
        user = await UsersMongoModel.findOne({email: email})

    }catch(err){
        user = {error: err, message: 'unable to search db for requested user'}
        logError.error(user.message)
        done(user, false)
    }
    if (user == null) {
        let warning = 'invalidUser: User is not registered!'
        logWarn.warn(warning);
        done(null, false, warning)
    } else if (!passwordValidation(user, password)) {
        let warning = 'invalidPassword: incorrect password!'
        logWarn.warn(warning)
        done(null, false, warning)
    } else{
        done(null, user)
    }
}))

//Registration Local-Strategy--------------------------------------------------------------------
passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true,
},  async function (req, email, password, done) {
        let existingUser;
        try{
            existingUser = await UsersMongoModel.findOne({ email: 'email' })  
        } catch(err) {
            existingUser = {error: err, message: 'unable to verify existance of requested user'}
            logError.error(existingUser.message)
            done(existingUser, false)
        }
        if (existingUser) {
            let warning = 'registeredUser: User already exists!'
            logWarn.warn(warning);
            done(null, false, warning)
        }
        
        log.info('registrating new user')
        let newUser = {
            realname: req.body.realname,
            email: email, 
            password: createHash(password),
            phone: parseInt(req.body.phone),
            admin: req.body.admin 
            /* here we could: 
            1-Validate it from the Front end with a dessignated function to verify if this is true
            by sending a password to a database, etc.
            2-Create another special endpoint that always passes admin: true as a query */ 
        };
        let chartForUser = await chartMaker(email)
        newUser = {...newUser, assignedChartId: chartForUser.doc._id}
        try{
            newUser = await UsersMongoModel.create(newUser)
            let newUserAlert = `New user registered! ${newUser.email} ${newUser.realname}`
            log.info(newUserAlert)
            let mailInfo = {
                to: [newUser.email, 'newregistrations@CHBE.com'],
                subject: `Hola ${newUser.realname}! bienvenido a nuestra plataforma`,
                text: '',
                html: `
                <h2>Hola ${newUser.realname}!</h2>
                <p>Tu usuario ha sido registrado con los siguientes datos</p>
                <ul>
                <li>Email: ${newUser.email}</li>
                <li>Telefono: ${newUser.phone}</li>
                </ul>`
            }
            await sendMail(mailInfo)
            log.info(TWILIO.ADMINNUMBER)
            sndWhatsappMessage(newUserAlert, TWILIO.ADMINNUMBER)
            done(null, newUser)
        } catch(err) {
            newUser = {error: err, message: 'unable to create user on the DB'}
            logError.error(newUser.error)
            done(newUser.error, false)
        }
           
    })
)

