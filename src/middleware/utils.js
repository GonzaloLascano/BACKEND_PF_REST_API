const {TWILIO} = require('../../config/config')
const { sndWhatsappMessage } = require('../../config/twilioConfig')
const { sendMail } = require('../../config/nodemailerConfig') 
const { log } = require('../../config/log')
const bcrypt = require('bcrypt')

//------ TWILIO and Nodemailer messaging --------
const messaging = (soldChart, buyerUser) => {
    let soldProductsNames = soldChart.prods.map( a => a.name ).join(", ")
    let soldProductsList = JSON.stringify(soldChart.prods.map(a => `${a.name}: $ ${a.price}`).join(", "))
    log.info(soldProductsList, 'sold')
    let buyerWText = `Felicidades, tu compra de: ${soldProductsNames} ha sido aprobada. En breve recibiras mas informacion por tu email.`
    let sellerWText = `Nueva venta realizada. A ${buyerUser.email}.`
    let sellMailTemplate = `
        <h1>Felicidades ${buyerUser.realname}!</h1>
        <hr>
        <p>Tu orden de compra: ${soldChart._id} se ha procesado con exito! Te dejamos los detalles a continuación:</p>
        <ul>
            <li>Productos: ${soldProductsList}</li>
            <li>Total: $${soldChart.totalPrice}</li>
            <li>Domicilio de entrega: ${soldChart.destinyAddress}</li>
            <li>Estado del pago: exitoso</li>
        </ul>
    `
    let sellMailInfo = {
        to: buyerUser.email,
        subject: 'Confirmacion de venta!',
        text: '',
        html: sellMailTemplate
    }
    sndWhatsappMessage(sellerWText, TWILIO.ADMINNUMBER)
    /* sndWhatsappMessage(buyerWText, buyerUser.phone) -- commented to avoid sending actual messeges to random test numbers.*/
    sendMail(sellMailInfo)
}

//Payment result simulation. This should be replaced by a middleware called before
//purchase confirmation, that sends a request to a payment API.
const paymentSuccessSim = (pi,amount) => {
    pi
    amount
    return Math.random() < 0.70
}

//Password Encrypting --------------------
function createHash(password){
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10)
    )
 }
 
 function passwordValidation(user, password) {
    return bcrypt.compareSync(password, user.password)
}

module.exports = { messaging, paymentSuccessSim, createHash, passwordValidation }