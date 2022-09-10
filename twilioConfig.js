const twilio = require('twilio');
const { logError } = require('./log');

const accountSid = 'ACa9b9b98efc842e7e55fb1cff6ce4b4b5';//replace in .env
const authToken = '204b467a73113a2631b8ca06599f18de';//replace in .env

const client = twilio(accountSid, authToken);

function sellMessage(text, reciever) {
    try {
        client.messages.create({
           body: text,
           from: 'whatsapp:+14155238886',//replace in .env
           to: 'whatsapp:+' + reciever
       }) 
   } catch (err) {
       logError.error(err)
   }
}

module.exports = { sellMessage }