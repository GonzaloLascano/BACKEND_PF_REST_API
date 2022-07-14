const mongoose = require('mongoose')
const { productMongoSchema } = require('./productsMongo')

const chartCollectionName = 'charts'

const chartsMongoSchema = new mongoose.Schema({
    chartId: Number,
    time: Number,
    prods:[productMongoSchema] 
})

const ChartMongoModel = mongoose.model(chartCollectionName, chartsMongoSchema)

module.exports = ChartMongoModel