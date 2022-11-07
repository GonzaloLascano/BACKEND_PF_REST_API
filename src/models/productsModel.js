const mongoose = require('mongoose')

const prodCollectionName = 'products'

const productMongoSchema = new mongoose.Schema({
    name: {
        type: String, 
        maxLength: [40, 'Name is too long'], 
        required: [true, 'Product name needed'],
    }, 
    description: {
        type: String, 
        maxLength: [100, 'Product description is too long'], 
        required: [true, 'Product description needed'],
    },
    photo: {
        type: String,  
        required: [true, 'Product picture needed'],
    },
    code: {
        type: String,
        maxLength: 8,
        minLength: 3,
        required: [true, 'Need to provide a product code: 3 to 8 characters'] 
    },
    category: String,
    price: {
        type: Number,
        required:[true, 'Need to specify a price']
    },
    stock: {
        type: Number,
        max: [100, 'stock number too high!'],
        required:[true, 'Need to specify stock']
    }
},
{
    timestamps: true //saved in utc its suppossed to be converted to servers timezone.
})

const ProdMongoModel = mongoose.model(prodCollectionName, productMongoSchema)

module.exports = { ProdMongoModel, productMongoSchema } 