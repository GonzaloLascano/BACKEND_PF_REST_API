const mongoose = require('mongoose')

const prodCollectionName = 'products'

const productMongoSchema = new mongoose.Schema({
    prodId: Number,
    timestamp: Number,
    name: String,
    description: String,
    code: String,
    photo: String,
    price: Number,
    stock: Number
})

const ProdMongoModel = mongoose.model(prodCollectionName, productMongoSchema)

module.exports = { ProdMongoModel, productMongoSchema } 