/* controlador de carritos de Mongo */
const mongoose = require('mongoose');
const { logError, log } = require('../log');
const ChartMongoModel = require('../models/db/chartsMongo')
const { ProdMongoModel } = require('../models/db/productsMongo')
const { UsersMongoModel } = require('../models/db/mongoUsers')
const { sellMessage } = require('../twilioConfig.js')

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

const purchaseChart = async (req, res) => {
    let soldChart
    let buyerUser
    
    //identificando el chart a comprar
    try{
        soldChart = await ChartMongoModel.findOne({chartId: req.params.id});
        log.info(soldChart + 'at purchase sold')
        buyerUser = await UsersMongoModel.findOne({email: req.session.passport.user});
        
        // se construyen funciones para verificar stock van aca
        // si se contruyen funciones para ejecutar pagos van aca
        // si se construyen funciones para descartar stock van aca

        //una vez superadas todas las etapas previas se envia mensaje de confirmacion
        //tanto al comprador como al vendedor

        let soldProductsNames = soldChart.prods.map( a => a.name )
        let buyerText = `Felicidades, tu compra de: ${soldProductsNames} ha sido aprobada. En breve recibiras mas informacion.`
        let sellerText = `Nueva venta de: ${JSON.stringify(soldChart.prods)} realizada. a ${req.session.passport.user}.`
        let sellerPhone = '5491124049941'
        sellMessage(sellerText, sellerPhone)//configurar sellerphone en variable de entorno.
        sellMessage(buyerText, buyerUser.phone)
        res.send('compra exitosa')
    } catch(err) {
        logError.error('at purchase' + err);
        res.send('error en la compra' + err)  
    }

}

module.exports = {createChartM, deleteChartM, getChartProductsM, addProductToChartM, deleteChartProductM, purchaseChart}