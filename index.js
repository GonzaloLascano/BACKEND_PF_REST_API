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
    let error = {mensaje: 'Product not found'}
    req.idProduct = products.find(product => product.id == req.params.id)
    if (req.params.id === undefined) {res.json(products)}
    else if(req.idProduct){
        next()
    }
    else {res.json(error)}
}

function prodToChartVerif (req, res, next){
    let error = {mensaje: 'Product not found'}
    req.idProduct = products.find(product => product.id == req.params.id_prod)
    if(req.idProduct){
        next()
    }
    else {res.json(error)}
}

function middleChartIdentifier (req, res, next){
    if (req.params.id) {
        let error = {mensaje: 'no charts found'}
        req.idChart = charts.find(chart => chart.id == req.params.id)
        if(req.idChart){
            next()
        }
        else {res.json(error)}
        }
    else {next()}
}

//lector de archivos almacenados para rellenar products y chart (PARA FUTUROS USOS)
/* function middleLoader (req, res, next){
    products = loadFile(productsPath)
    charts = loadFile(chartsPath)
    next()
} */

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


prodRouter.get('/:id?', middleIdentifier, (req, res) =>{
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

prodRouter.post('/', middleAdminSim, (req, res) => {
    console.log(products)
    let reqProd = req.body
    let newProduct = new Product(0, Date.now(), reqProd.name, reqProd.description, reqProd.code, reqProd.photo, parseInt(reqProd.price), parseInt(reqProd.stock))
    newProduct.id = products.length === 0 ? 1 : (products[products.length - 1].id + 1)
    console.log(newProduct)
    products.push(newProduct)
    writeFile(products, productsPath)
    res.json({mensaje: `You have successfully added new product: ${newProduct.name}, id: ${newProduct.id} with the price of $${newProduct.price}`})
})

prodRouter.put('/:id', middleAdminSim,  middleIdentifier, (req, res)=>{
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
    res.json({mensaje: 'Product successfully modified!'})
})

prodRouter.delete('/:id',middleAdminSim, middleIdentifier, (req, res) => {
    products = products.filter(product => product !== req.idProduct)
    console.log(products)
    writeFile(products, productsPath)
    res.json({mensaje: 'product successfully deleted'})
})

/* Chart Router */

chartRouter.post('/', (req, res) =>{
    let newChart = new Chart(0, Date.now(), [])
    newChart = {...newChart, id: (charts.length === 0 ? 1 : (charts[charts.length - 1].id + 1))}
    charts.push(newChart)
    writeFile(charts, chartsPath)
    res.json({mensaje: `New empty chart created! id: ${newChart.id}`})
})

chartRouter.delete('/:id',(req, res) => {
    charts = charts.filter((chart) => {
        if (chart.id != req.params.id) {
            return chart
        }    
    })
    charts = charts.filter(chart => chart.id !== req.params.id)
    console.log(charts)
    writeFile(charts, chartsPath)
    res.json({message: 'chart deleted successfully'})  
    console.log('chart deleted successfully')
})

chartRouter.get('/:id/productos', middleChartIdentifier, (req, res) =>{                           
    console.log(req.idChart.prods)
    if (req.idChart.prods.length > 0) {
        res.json(req.idChart.prods)
    }
    else {res.json('chart is empty')}
})

chartRouter.post('/:id/productos/:id_prod', middleChartIdentifier, prodToChartVerif,(req, res) =>{                         
    charts = charts.map((chart) => {
        if (chart.id == req.params.id){
            chart.prods.push(req.idProduct)
        }
        return chart;
    })
    writeFile(charts, chartsPath)
    res.json({message: 'added ok'})
})

chartRouter.delete('/:id/productos/:id_prod', middleChartIdentifier, (req, res) =>{                          
    let modChart = charts.map((idChart) => {
        if (idChart.id == req.params.id){
            idChart.prods = idChart.prods.filter(prod => prod.id != req.params.id_prod)
            console.log(idChart.prods)
            return idChart
        }
        return idChart
    })
    if (modChart == charts) {res.json({message: 'no products deleted'})}
    else{
        console.log(modChart)
        writeFile(modChart,chartsPath)
        res.json({message:"product deleted successfully from chart"})
    }
})
/*Starting app ------------------------------------------------ */
products = loadFile(productsPath)
charts = loadFile(chartsPath)

/* initializing server -----------------------------------------------*/

const server = app.listen(PORT, () =>{
    console.log('server listening on port: ' + server.address().port)
})
server.on('error', error => console.log({mensaje: `could not initiate server: ${error}`}))


app.use('/api/productos', prodRouter)
app.use('/api/carrito', chartRouter)