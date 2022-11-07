const { UsersMongoModel } = require('../models/usersModel')
const { logWarn, log } = require('../../config/log')

//User Authentication-----------------------------------
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

//Admin Authorization-----------------------------------
async function adminAuth (req, res, next) {
   let isAdmin
   if (!req.session.passport.admin){
       isAdmin = await UsersMongoModel.findById(req.session.passport.user)
       isAdmin = isAdmin.admin
   }
   isAdmin ? next() : res.json({authorized: false, message:'user is not authorized'})
}

module.exports = { checkAuthentication, adminAuth }