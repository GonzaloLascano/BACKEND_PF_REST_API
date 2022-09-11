const twilio = require('twilio');
const { logError } = require('./log');
const { TWILIO } = require('./config')

const accountSid = TWILIO.SID;//replace in .env
const authToken = TWILIO.AUTHTOKEN;//replace in .env

const client = twilio(accountSid, authToken);

function sndWhatsappMessage(text, reciever) {
    try {
        client.messages.create({
           body: text,
           from: 'whatsapp:+' + TWILIO.ACCOUNTNUMBER, //replace in .env
           to: 'whatsapp:+' + reciever
       }) 
   } catch (err) {
       logError.error(err)
   }
}

module.exports = { sndWhatsappMessage }