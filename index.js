require('dotenv').config();
const express = require('express')
const routes = require('./src/routes/indexRoute')
const app = express()
const { SERVER, SESSION, MONGO, } = require('./config/config')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash');
const mongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const connectMong = require('./config/dbConfig.js')
const {log, logError, logWarn} = require('./config/log.js')
const { engine } = require('express-handlebars')

/* initializing server -----------------------------------------------*/

const server = app.listen(SERVER.PORT, async () => {
    await connectMong();
    log.info('server listening on port: ' + server.address().port)
})
server.on('error', error => logError.error(`could not initiate server: ${error}`))

//Middleware------------------------------------------------------------

//Parsers
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//Calling session
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
// Calling passport
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

//Calling Routes
app.use(routes)

//Setting View Engine
app.engine(
    'hbs',
    engine()
)
app.set("view engine", 'hbs')
app.set("views", "./views")
