const mongoose = require('mongoose')

const chartCollectionName = 'charts'

const chartsMongoSchema = new mongoose.Schema({
    email: {
        type: String, 
        match: [/[\w-.]+@+\w+[.]+com/, 'The email does not match the requested format'], 
        required: [true, 'Please insert an email address'],
    },
    prods:[{_id: String, name: String, price: Number, amount: Number}],
    totalPrice: Number,
    destinyAddress: String, // this should be validated by consulting a zip code database/api
    purchased: Boolean  
}, {
    timestamps: true
})

const ChartMongoModel = mongoose.model(chartCollectionName, chartsMongoSchema)

module.exports = ChartMongoModel