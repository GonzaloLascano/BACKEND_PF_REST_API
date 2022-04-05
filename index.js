//const memory = require('./memory')
const express = require('express')
const { Router } = require('express')
const app = express()

/* memory */

const fs = require('fs')

const products = []
let productsPath = './memory/products.txt'
const charts = []
let chartsPath = './memory/charts.txt'

class Chart {
    constructor(id, time, prods) {
        this.id = id
        this.time = time
        this.prods = prods
    }
}

class Product {
    constructor(id, timestamp, name, description, code, photo, price, stock) {
        this.id = id
        this.timestamp = timestamp
        this.name = name
        this.description = description
        this.code = code
        this.photo = photo
        this.price = price
        this.stock = stock
    }
}

/* File System functions. */
async function loadFile(object, path){
    try{
        object = await fs.promises.readFile(path, 'utf-8')
    }
    catch (err){
        console.log('could not read file! ' + err)
    }
}

async function writeFile(object, path){
    try{
        await fs.promises.writeFile(path, JSON.stringify(object))
    }
    catch (err){
        console.log('could not write file! ' + err)
    }
}


/* --------------- */

const PORT = 8080

/* initializing server -----------------------------------------------*/

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
const chartRouter = express.Router()

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
    let reqProd = req.body
    let newProduct = new Product(0, Date.now(), reqProd.name, reqProd.description, reqProd.code, reqProd.photo, parseInt(reqProd.price), parseInt(reqProd.stock))
    newProduct.id = products.length === 0 ? 1 : (products[products.length - 1].id + 1)
    console.log(newProduct)
    products.push(newProduct)
    writeFile(products, productsPath)
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
    writeFile(products, productsPath)
    res.json({mensaje: 'Objeto modificado con exito!'})
})

prodRouter.delete('/:id',middleAdminSim, middleLoader, (req, res) => {
    products = products.filter((product) => {
        if (product.id != req.params.id) {
            return product
        }    
    })
    console.log(products)
    writeFile(products, productsPath)
    res.json({mensaje: 'product deleted successfully'})
})

/* Chart Router */

chartRouter.post('/', middleLoader, (req, res) =>{
    let newChart = new Chart(0, Date.now(), [])
    newChart = {...newChart, id: (charts.length === 0 ? 1 : (charts[charts.length - 1].id + 1))}
    console.log(newChart)
    charts.push(newChart)
    writeFile(charts, chartsPath)
    res.json({mensaje: `New empty chart created: id: ${newChart.id}`})
})

chartRouter.delete('/:id', middleLoader, (req, res) => {
    charts = charts.filter((chart) => {
        if (chart.id != req.params.id) {
            return chart
        }    
    })
    console.log(charts)
    writeFile(charts, chartsPath)
    console.log('chart deleted successfully')
})

chartRouter.get('/:id/productos', middleLoader, (req, res) =>{                           
    let idChart = charts.filter((chart) =>{
        if(chart.id == req.params.id) {
            return chart
        }
    })
    console.log(idChart.prods)
    res.json(idChart.prods)
})

chartRouter.post('/:id/productos', middleLoader, (req, res) =>{                         
    charts = charts.map((idChart) => {
        if (idChart.id == req.params.id){
            idChart.prods.concat(req.body)
        }
    })
    writeFile(charts, chartsPath)
})

chartRouter.delete('/:id/productos/:id_prod', middleLoader, (req, res) =>{                          
    charts = charts.map((idChart) => {
        if (idChart.id == req.params.id){
            idChart.prods = idChart.prods.filter((prod) =>{
                if (prod.id != req.params.id_prod) {
                    return prod
                }
            })
        }
    })
})



/* ------------------------------------------------ */

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
    loadFile(products, productsPath)
    loadFile(charts, chartsPath)
    next()
}

function middleAdminSim (req, res, next){
    req.query.admin == 1 ? next() : res.send('request denied')
}