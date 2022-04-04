const express = require('express')
const { Router } = require('express')
const app = express()

const PORT = 8080

/* initializing server */
const server = app.listen(PORT, () =>{
    console.log('server listening on port: ' + server.address().port)
})
server.on('error', error => console.log({mensaje: `could not initiate server: ${error}`}))

app.use('./api/productos', prodRouter)
app.use('./api/carrito', chartRouter)
app.use(express.urlencoded({ extended: true })) //puede que haya que usarlo con cada router en lugar de con app
app.use(express.json()) //puede que haya que usarlo con cada router en lugar de con app

/* productsRouter */
const prodRouter = express.Router()

prodRouter.get('/:id?', middleLoader, middleIdentifier, (req, res) =>{ //falta agregar lector de archivos para actualizar
    if (req.params.id) {                                 //variable producto
        let idProduct = req.idProduct
        console.log(idProduct)
        res.json(idProduct)
    }
    else{
        console.log(products)
        res.json(products)
    }

})

prodRouter.post('/', middleAdminSim, middleLoader, (req, res) =>{
    let newProduct = req.body
    newProduct = {...newProduct, id: (products.length === 0 ? 1 : (products[products.length - 1].id + 1))}
    console.log(newProduct)
    products.push(newProduct)
    writeProds()
    res.json({mensaje: `You have successfully added new product: ${newProduct.name}, id: ${newProduct.id} with the price of $${newProduct.price}`})
})

prodRouter.put('/:id', middleAdminSim, middleLoader, (req, res)=>{
    products = products.map(product => {
        if (product.id == req.params.id) {
            product = {...req.body, id: product.id}
            return product
        }
        else {
            return product
        }
    })
    console.log(products)
    writeProds()
    res.json({mensaje: 'Objeto modificado con exito!'})
})

prodRouter.delete('/:id',middleAdminSim, middleLoader, (req, res) => {
    products = products.filter((product) => {
        if (product.id != req.params.id) {
            return product
        }    
    })
    console.log(products)
    writeProds()
    res.json({mensaje: 'product deleted successfully'})
})

/*  */

/* middleware */
// identificador de producto por ID en caso de existir el parametro
function middleIdentifier (req, res, next){
    if (req.params.id) {
        let error = {mensaje: 'No se pudo encontrar el producto buscado'}
        req.idProduct = products.filter((product) => {
            if (product.id == req.params.id) {
                return product
            }
        })
        if(req.idProduct.length == 0){
            res.json(error)
        }
        else {next()}
    }
    else {next()}
}

//lector de archivos almacenados para rellenar products y chart
function middleLoader (req, res, next){
    loadProds()
    loadChart()
    next()
}

function middleAdminSim (req, res, next){
    req.query.admin == 1 ? next() : res.send('request denied')
}