const { productsPath, Product } = require('../models/fs/productfs')
let { products } = require('../models/fs/productfs')
const { writeFile } = require('../models/fs/utils')

const getProducts = (req, res) => {
    if (req.params.id) {
        let idProduct = req.idProduct
        res.json(idProduct)
    } else {
        res.json(products)
    }
}

const addProduct = (req, res) => {
    let reqProd = req.body
    let newProduct = new Product(0, Date.now(), reqProd.name, reqProd.description, reqProd.code, reqProd.photo, parseInt(reqProd.price), parseInt(reqProd.stock))
    newProduct.id = products.length === 0 ? 1 : (products[products.length - 1].id + 1)
    products.push(newProduct)
    writeFile(products, productsPath)
    res.json({mensaje: `You have successfully added new product: ${newProduct.name}, id: ${newProduct.id} with the price of $${newProduct.price}`})
}

const modifyProduct = (req, res) => {
    products = products.map(product => {
        if (product.id == req.params.id) {
            product = {...product, ...req.body}
            return product
        }
        else {
            return product
        }
    })
    writeFile(products, productsPath)
    res.json({mensaje: 'Product successfully modified!'})
}

const deleteProduct = (req, res) => {
    products = products.filter(product => product !== req.idProduct)
    writeFile(products, productsPath)
    res.json({mensaje: 'product successfully deleted'})
}

// identificador de producto por ID en caso de existir el parametro
function middleIdentifier (req, res, next) {
    let error = {mensaje: 'Product not found'}
    req.idProduct = products.find(product => product.id == req.params.id)
    //if (req.params.id === undefined) {res.json(products)}
    //else 
    if (req.idProduct || (req.params.id === undefined)) {
        next()
    }
    else {res.json(error)}
}

function prodToChartVerif (req, res, next) {
    let error = {mensaje: 'Product not found'}
    req.idProduct = products.find(product => product.id == req.params.id_prod)
    if(req.idProduct){
        next()
    }
    else {res.json(error)}
}

//lector de archivos almacenados para rellenar products y chart (PARA FUTUROS USOS)
/* function middleLoader (req, res, next){
    products = loadFile(productsPath)
    charts = loadFile(chartsPath)
    next()
} */

//simulador de permiso de administrador
function middleAdminSim (req, res, next) {
    req.query.admin == 1 ? next() : res.send('Access denied. Unauthorized request or route.')
}


module.exports = {
    getProducts, addProduct, modifyProduct, deleteProduct, middleAdminSim, middleIdentifier, prodToChartVerif,    
}