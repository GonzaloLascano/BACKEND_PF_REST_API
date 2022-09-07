const express = require('express')
const routes = require('./routes/rindex')
const app = express()
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const session = require('express-session')
const connectMong = require('./dbConfig')
const mongoStore = require('connect-mongo')
const passport = require('passport')
const { engine } = require('express-handlebars')

/* initializing server -----------------------------------------------*/

const PORT = 8080

const server = app.listen(PORT, async () => {
    await connectMong();
    console.log('server listening on port: ' + server.address().port)
})
server.on('error', error => console.log({mensaje: `could not initiate server: ${error}`}))//log error

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Llamando session
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: "mongodb+srv://cosme:fulanito@cluster0.cd55fdx.mongodb.net/ecommerce?retryWrites=true&w=majority",
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
