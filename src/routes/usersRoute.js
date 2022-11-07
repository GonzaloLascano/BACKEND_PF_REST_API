const passport = require('passport');
require('../middleware/passport');
const userRouter = require('express').Router();
const { exit, getLogin, regForm, userFailureHandler } = require('../controllers/userCntrl');
const { checkAuthentication, adminAuth } = require('../middleware/auth');
const { reqLog } = require('../middleware/reqLog.js')

userRouter.all('*', reqLog)

//Registration
userRouter.get('/reg', regForm)
userRouter.post('/reg', passport.authenticate('register', {failureRedirect: '/users/reg', failureFlash: true , successRedirect: '/users/login', passReqToCallback:true}))

//Login
userRouter.get('/login', getLogin)
userRouter.post('/login', passport.authenticate('login', { successRedirect: '/api/productos', failureRedirect:'/users/failure', failureFlash: true, passReqToCallback: true}))

//dummy private content (for testing)
userRouter.get('/private', checkAuthentication, adminAuth, (req,res)=>{
    res.json({message: 'if you see this, you are authenticated and an admin!'})    
})

//Logout
userRouter.get('/logout', exit)

//Failure
userRouter.get('/failure', userFailureHandler)

module.exports = userRouter