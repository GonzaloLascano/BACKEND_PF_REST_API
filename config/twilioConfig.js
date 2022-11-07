const twilio = require('twilio');
const { logError } = require('./log');
const { TWILIO } = require('./config')

const accountSid = TWILIO.SID;
const authToken = TWILIO.AUTHTOKEN;

const client = twilio(accountSid, authToken);

function sndWhatsappMessage(text, reciever) {
    try {
        client.messages.create({
           body: text,
           from: 'whatsapp:+' + TWILIO.ACCOUNTNUMBER,
           to: 'whatsapp:+' + reciever
       }) 
   } catch (err) {
       logError.error(err)
   }
}

module.exports = { sndWhatsappMessage }