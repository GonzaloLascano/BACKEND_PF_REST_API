const { logError, log, logWarn, } = require('../log.js')
//Session and Registration

let user = []

const getForm = (req, res) => {
    user = req.session.passport.user
    res.render('formulario', {user}) //product entry form
}

const regForm = (req, res) => {
    res.render('indexRegistration')
}

const getLogin = (req, res) => {
    res.render('indexLogin')
}

const exit = (req, res) => {
    try {
        let quittingUser = req.session.passport.user
        log.info('User logging out ' + req.session.passport.user)
        req.session.destroy();
        res.render('logout', { quittingUser });
    } catch (error) {
        logError.error('Unable to log out' + error);
        res.status(500).send("error: ", error);
    } 
}

//Error Handling

const errorReg = (req, res) => {
    logError.error('Registration error');
    let err = 'registration error'
    res.render('userError', {err});
}

const errorLogin = (req, res) => {
    logError.error('wrong user credentials');
    let err = 'wrong credentials'
    res.render('userError', {err});
}

module.exports = { getForm, exit, errorReg, errorLogin, regForm, getLogin}