//------------------------ NOT AVAILABLE FOR PRODUCTION!!!!------------------------------
//------------------- sent to production for academic purposes--------------------------

const { NODEMAILER } = require('./config')
const nodemailer = require('nodemailer');
const { logError,log } = require('./log');

let transporter = nodemailer.createTransport({
    //Ethereal Email, configured for testing purposes only
    host: NODEMAILER.HOST || 'smtp.ethereal.email',
    port: NODEMAILER.MAILERPORT || 587,
    auth: {
      user: NODEMAILER.AUTHUSER || 'josh42@ethereal.email',
      pass: NODEMAILER.AUTHPASSWORD || '714B4UVjpq8dM69jGu'
    },
    tls: {
        rejectUnauthorized: false
    },      
})

const sendMail = async (mailInfo) => {
    try{
        await transporter.sendMail({
            from: NODEMAILER.AUTHUSER ||"josh42@ethereal.email",
            to: mailInfo.to,
            subject: mailInfo.subject, 
            text: mailInfo.text,
            html: mailInfo.html, 
        })
        log.info('message sent!')
    }catch(err){
        logError.error('could not send email', err)
    }
}

module.exports = { sendMail }

