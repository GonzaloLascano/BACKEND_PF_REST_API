/* controlador de carritos de Mongo */
const mongoose = require('mongoose');
const ChartMongoModel = require('../models/db/chartsMongo')
const { ProdMongoModel } = require('../models/db/productsMongo')

const createChartM = async (req, res) => {
    try {
        const idCount = await ChartMongoModel.findOne({}, {chartId:1}).sort({chartId: -1});
        console.log(idCount);  
        const response = await ChartMongoModel.create({chartId: idCount == null ? 1 : idCount.chartId + 1, time: Date.now(), prods: []})
        res.json({mensaje: `New empty chart created! id: ${response.chartId}`})
    } catch (err) {
        console.log(err);
        res.json({mesaje:'could not create chart'});
    }
    
}

const deleteChartM = async (req, res) => {
    try{
        const response = await ChartMongoModel.deleteOne({chartId: req.params.id})
        console.log(response)
        res.json({message: 'chart deleted successfully'})
    } catch(err) {
        console.log(err);
        res.json({mesaje:'could not delete requested chart'});    
    }
      
}

const getChartProductsM =  async (req, res) => {
    try{
        const response = await ChartMongoModel.findOne({chartId: req.params.id})
        console.log(response.prods)                      
        if (response.prods.length > 0) {
            res.json(response.prods)
        }
        else {res.json('chart is empty')}

    } catch(err) {
        console.log(err);
        res.json({mesaje:'could not read database'});
    }    
    
}

const addProductToChartM = async (req, res) => {  
    try{
        const prodToAdd = await ProdMongoModel.findOne({prodId: req.params.id_prod})
        const selectedChart = await ChartMongoModel.findOneAndUpdate({chartId: req.params.id}, {$push: {prods: prodToAdd}})
        res.json({message: 'added ok'})
    } catch(err) {
        console.log(err);
        res.json({mesaje:'could not add product to recuested chart'});
    }                      
    
}

const deleteChartProductM =  async (req, res) => {
    try {
        const selectedChart = await ChartMongoModel.findOneAndUpdate({chartId: req.params.id}, 
            { $pull: 
                {prods: 
                    { prodId: req.params.id_prod} 
                }
            }
        )
        res.json({message:"product deleted successfully from chart"})
    } catch(err){
        console.log(err);
        res.json({mesaje:'could not delete requested product from chart'});
    }
    
}

module.exports = {createChartM, deleteChartM, getChartProductsM, addProductToChartM, deleteChartProductM}