const express = require('express')
const routes = require('./routes/rindex')
const app = express()
const connectMong = require('./dbConfig')

/* initializing server -----------------------------------------------*/

const PORT = 8080

const server = app.listen(PORT, async () => {
    await connectMong();
    console.log('server listening on port: ' + server.address().port)
})
server.on('error', error => console.log({mensaje: `could not initiate server: ${error}`}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)
