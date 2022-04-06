const express = require('express')
const { Router } = require('express')
const { json } = require('express/lib/response')
const app = express()

/* memory */

const fs = require('fs')

const admin = 1
let products = []
let productsPath = './memory/products.txt'
let charts = []
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
function loadFile(path){
    try{
        return JSON.parse(fs.readFileSync(path, 'utf-8'))
    }
    catch (err){
        console.log('could not read file! ' + err)
        return []
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

function middleChartIdentifier (req, res, next){
    if (req.params.id) {
        let error = {mensaje: 'No se pudo encontrar el carrito buscado'}
        req.idChart = charts.filter((chart) => {
            if (chart.id == req.params.id) {
                return chart
            }
        })
        if(req.idChart.length == 0){
            res.json(error)
        }
        else {next()}
    }
    else {next()}
}

//lector de archivos almacenados para rellenar products y chart
function middleLoader (req, res, next){
    products = loadFile(productsPath)
    charts = loadFile(chartsPath)
    next()
}
//simulador de permiso de administrador
function middleAdminSim (req, res, next){
    req.query.admin == 1 ? next() : res.send('Access denied. Unauthorized request or route.')
}

/* routers--------------------- */

/* productsRouter */

const prodRouter = express.Router()
const chartRouter = express.Router()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

prodRouter.get('/:id?', middleLoader, middleIdentifier, (req, res) =>{
    if (req.params.id) {
        let idProduct = req.idProduct
        console.log(idProduct)
        res.json(idProduct)
    }
    else{
        console.log(products)
        res.json(products)
    }

})

prodRouter.post('/', middleAdminSim, middleLoader, (req, res) => {
    console.log(products)
    let reqProd = req.body
    let newProduct = new Product(0, Date.now(), reqProd.name, reqProd.description, reqProd.code, reqProd.photo, parseInt(reqProd.price), parseInt(reqProd.stock))
    newProduct.id = products.length === 0 ? 1 : (products[products.length - 1].id + 1)
    console.log(newProduct)
    products.push(newProduct)
    writeFile(products, productsPath)
    res.json({mensaje: `You have successfully added new product: ${newProduct.name}, id: ${newProduct.id} with the price of $${newProduct.price}`})
})

prodRouter.put('/:id', middleAdminSim, middleLoader, middleIdentifier, (req, res)=>{
    products = products.map(product => {
        if (product.id == req.params.id) {
            product = {...product, ...req.body}
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

prodRouter.delete('/:id',middleAdminSim, middleLoader, middleIdentifier, (req, res) => {
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
    res.json({message: 'chart deleted successfully'})  
    console.log('chart deleted successfully')
})

chartRouter.get('/:id/productos', middleLoader, middleChartIdentifier, (req, res) =>{                           
    let idChart = charts.filter((chart) =>{
        if(chart.id == req.params.id) {
            return chart
        }
    })
    console.log(idChart[0].prods)
    res.json(idChart[0].prods)
})

chartRouter.post('/:id/productos', middleLoader, middleChartIdentifier,(req, res) =>{                         
    console.log(req.params.id)
    charts = charts.map((chart) => {
        console.log(chart.id)
        if (chart.id == req.params.id){
            chart.prods.push(...req.body)
        }
        return chart;
    })
    writeFile(charts, chartsPath)
    res.json({message: 'added ok'})
})

chartRouter.delete('/:id/productos/:id_prod', middleLoader, middleChartIdentifier, (req, res) =>{                          
    let modChart = charts.map((idChart) => {
        if (idChart.id == req.params.id){
            idChart.prods = idChart.prods.filter((prod) =>{
                if (prod.id != req.params.id_prod) {
                    return prod
                }
            })
        }
        return idChart
    })
    if (modChart = charts) {res.json({message: 'no products deleted'})}
    else{
        console.log(modChart)
        writeFile(modChart,chartsPath)
        res.json({message:"product deleted successfully from chart"})
    }
})
/* ------------------------------------------------ */

/* initializing server -----------------------------------------------*/

const server = app.listen(PORT, () =>{
    console.log('server listening on port: ' + server.address().port)
})
server.on('error', error => console.log({mensaje: `could not initiate server: ${error}`}))


app.use('/api/productos', prodRouter)
app.use('/api/carrito', chartRouter)