const { loadFile } = require('./utils')

let products = []
let productsPath = './memory/products.txt'

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

products = loadFile(productsPath)

module.exports = {
    products, productsPath, Product
}