/* controlador de carritos de Mongo */
const mongoose = require('mongoose');
const ChartMongoModel = require('../models/db/chartsMongo')
const { ProdMongoModel } = require('../models/db/productsMongo')

const createChartM = async (req, res) => {
    const idCount = await ChartMongoModel.findOne({}, {chartId:1}).sort({chartId: -1});
    console.log(idCount);  
    const response = await ChartMongoModel.create({chartId: idCount == null ? 1 : idCount.chartId + 1, time: Date.now(), prods: []})
    res.json({mensaje: `New empty chart created! id: ${response.chartId}`})
}

const deleteChartM = async (req, res) => {
    const response = await ChartMongoModel.deleteOne({chartId: req.params.id})
    console.log(response)
    res.json({message: 'chart deleted successfully'})  
}

const getChartProductsM =  async (req, res) => {     
    const response = await ChartMongoModel.findOne({chartId: req.params.id})
    console.log(response.prods)                      
    if (response.prods.length > 0) {
        res.json(response.prods)
    }
    else {res.json('chart is empty')}
}

const addProductToChartM = async (req, res) => {                         
    const prodToAdd = await ProdMongoModel.findOne({prodId: req.params.id_prod})
    const selectedChart = await ChartMongoModel.findOneAndUpdate({chartId: req.params.id}, {$push: {prods: prodToAdd}})
    res.json({message: 'added ok'})
}

const deleteChartProductM =  async (req, res) => {
    const selectedChart = await ChartMongoModel.findOneAndUpdate({chartId: req.params.id}, 
        { $pull: 
            {prods: 
                { prodId: req.params.id_prod} 
            }
        }
    )
    res.json({message:"product deleted successfully from chart"})
}

module.exports = {createChartM, deleteChartM, getChartProductsM, addProductToChartM, deleteChartProductM}