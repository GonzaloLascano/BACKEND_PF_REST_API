const express = require('express')
const app = express()

const PORT = 8080

/* initializing server */
const server = app.listen(PORT, () =>{
    console.log('server listening on port: ' + server.address().port)
})
server.on('error', error => console.log({mensaje: `could not initiate server: ${error}`}))

app.use('./api/productos', prodRoute)
app.use('./api/carrito', chartRoute)