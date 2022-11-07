const { logError, log, logWarn, } = require('../../config/log.js');


//--------- User Controllers: works along with Middleware "auth" and "passport" ----------------

let user = []

// Form Rendering Middleware for Previeweing --------

const getForm = (req, res) => {
    user = req.session.passport.user
    res.render('formulario', {user}) 
}

const regForm = (req, res) => {
    log.info(req.session.admin);
    req.session.passport?.user ? res.redirect(`/api/productos`) : res.render('indexRegistration') //registration entry form
}

const getLogin = (req, res) => {
    req.session.passport?.user ? res.redirect(`/api/productos`) : res.render('indexLogin') //log-in form
}

//-------------------------------------------------

const exit = (req, res) => {
    try {
        log.info('User logging out ' + req.session.passport.user)
        req.session.destroy();
        res.json({message: 'user logged out successfully!'});
    } catch (error) {
        logError.error('Unable to log out' + error);
        res.status(500).send("error: ", error);
    } 
}


const userFailureHandler = (req, res) => {
   let flashmessage = req.flash('error')[0]
   let messageArray = flashmessage.split(": ")
   let errorMessage = {error:true, type: messageArray[0], message: messageArray[1] }
   logError.error(errorMessage)
   res.json(errorMessage)
}

module.exports = { getForm, exit, regForm, getLogin, userFailureHandler}