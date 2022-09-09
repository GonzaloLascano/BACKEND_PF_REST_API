const twilio = require('twilio');
const { logError } = require('./log');

const accountSid = '';
const authToken = '';

const client = twilio(accountSid, authToken);

try {
    const message = await client.messages.create({
        body: 'Hola soy un mensaje de Node JS',
        from: 'numero mio',
        to: 'numero clte'
    }) 
} catch (err) {
    logError.error(err)
}