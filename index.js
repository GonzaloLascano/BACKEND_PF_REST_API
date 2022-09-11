require('dotenv').config();
const express = require('express')
const routes = require('./routes/rindex')
const app = express()
const { SERVER, SESSION, MONGO, } = require('./config/config.js')
const session = require('express-session')
const passport = require('passport')
const mongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const connectMong = require('./config/dbConfig.js')
const {log, logError, logWarn} = require('./config/log.js')
const { engine } = require('express-handlebars')

/* initializing server -----------------------------------------------*/

const server = app.listen(SERVER.PORTPORT, async () => {
    await connectMong();
    log.info('server listening on port: ' + server.address().port)
})
server.on('error', error => logError.error(`could not initiate server: ${error}`))//log error

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Llamando session
app.use(session({
    secret: SESSION.SECRET,
    resave: true,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: MONGO.MONGOURL,
        mongoOptions: advancedOptions,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 60000*10
    }
}))

// Llamando passport

app.use(passport.initialize());
app.use(passport.session());

app.use(routes)

app.engine(
    'hbs',
    engine()
)
app.set("view engine", 'hbs')
app.set("views", "./views")
