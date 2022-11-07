const config = {}

config.SERVER = {
    PORT: process.argv[2] || process.env.PORT || 8080, //este ultimo para poder distinguirlo mas facil del resto en caso de que algo falle.
}

config.MONGO = {
    MONGOURL: process.env.MONGOURL
}

config.SESSION = {
    SECRET: process.env.SESSIONSECRET,
    TIMER: process.env.TIMER
}

config.TWILIO = {
    SID: process.env.SID,
    AUTHTOKEN: process.env.AUTHTOKEN,
    ACCOUNTNUMBER: process.env.ACCOUNTNUMBER,
    ADMINNUMBER: process.env.ADMINNUMBER
}

config.NODEMAILER = {
    HOST: process.env.HOST,
    PORT: process.env.MAILERPORT,
    AUTHUSER: process.env.AUTHUSER,
    AUTHPASSWORD: process.env.AUTHPASSWORD
}

module.exports = {...config}