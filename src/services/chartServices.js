const { logError, log, logWarn } = require('../../config/log.js');
const ChartMongoModel = require('../models/chartsModel')
const { UsersMongoModel } = require('../models/usersModel')
const { paymentSuccessSim, messaging } = require('../middleware/utils')


const chartsLister = async () => {
    let response = await ChartMongoModel.find();
    response.length === 0 ? response = {message: 'no charts found'} : response;
    return response
}

const chartFinder = async (requestedChartId) => {
    let response
    try {
        response = await ChartMongoModel.findOne({ _id: requestedChartId });
    } catch (err) {
        let errorMessage = 'could not search requested chart on db';
        response = {message: errorMessage, error: err}
        logError.error(response)
    }
    if (response === null) {
        response = {message: 'Chart wasnt found', found: false}
        logWarn.warn(response)
    }
    return response
}

const chartMaker = async (email) => {
    let newChart = {
        email: email,
        prods: [],
        totalPrice: 0,
        destinyAddress: '',
        purchased: false
    }
    try{ 
        response = await ChartMongoModel.create(newChart)
        log.info(response + ' chart was added to DB ')
        response = {doc: response._doc, message: `chart created successfully`}   
    } catch(err) {
        response = {message: 'could not add requested product to db', error: err}
        logError.error(response);
    }
    return response
}

const chartUpdater = async (updates) => {
    let response
    try {
        response = ChartMongoModel.updateOne(
            {_id: updates._id},
            {$set:{
                ...updates
            }
        })
    } catch(err) {
        response = { err, message:'could not update requested chart' }
        logWarn.warn(response)
    }
    return response
}

const chartDeleter = async (requestedChartId) => {
    let response;
    console.log(requestedChartId)
    try {
        response = await ChartMongoModel.deleteOne({_id: requestedChartId})
        response = {...response, message: 'chart successfully deleted'}    
        log.info(response)
    } catch(err) {
        response = {message: 'unable to delete chart', error: err}
        logError.error(response);
    }
    return response
}

const productInChartUpdater = async (chartId, product, amount) => {//product vendria heredado de stockchecker
    let result
    let requestedChart = await chartFinder(chartId, false)
    let chartProductIndex = requestedChart.prods.findIndex(prod => prod._id == product._id)
    if (chartProductIndex === -1) {
        result = await productToChart(requestedChart._id, product, amount)
        return result      
    }
    requestedChart.prods[chartProductIndex].amount = amount
    let chartPrice = 0
    for (p of requestedChart.prods) {
        chartPrice += (p.price * p.amount)
    }
    requestedChart.totalPrice = chartPrice
    return result = await chartUpdater(requestedChart)
}

const productToChart = async (chartId, product, amount) => {
    let response;
    log.info('adding product to requested chart...')
    log.info(typeof amount)
    let productToAdd = {_id: product._id, name: product.name, price: product.price, amount}  
    try{
        response = await ChartMongoModel.updateOne(
            {_id: chartId},{
                $inc: {
                    totalPrice: (productToAdd.price * amount)
                },
                $push:{
                    prods: productToAdd
                }
            } 
        );
        response = {...response, message:'Product successfully added!'}
        log.info(response);
    } catch(err) {
        response = {error: err, message: 'unable to add product to the chart'}
        logError.error(response);
    }
    return response 
}

const chartProductDeleter = async (requestedChartId, requestedProductId) => {
    let response;
    let requestedChart = await chartFinder(requestedChartId, false)
    let chartProductIndex = requestedChart.prods.findIndex(prod => prod._id === requestedProductId)
    if (chartProductIndex == -1) {
        return response = {message:'The product is not inside the chart', inChart: false}
    }   
    let deletedProductsPrice = (requestedChart.prods[chartProductIndex].price * requestedChart.prods[chartProductIndex].amount) * -1
    log.info(deletedProductsPrice)
    try{
        response = await ChartMongoModel.updateOne({_id:requestedChartId},{
            $pull: {
                prods: {_id: requestedProductId}
            },
            $inc : {
                totalPrice: deletedProductsPrice
            }
        })
    } catch (err) {
        response = {message: 'could not remove product form chart and update its cost.', err}
        logError.error(response)
        return response
    }
    return {response, message: 'product successfully removed from chart.'}
}

const chartPurchaser = async (chartId, userMail, paymentInfo, destiny)=>{
    let soldChart
    let buyerUser
    try{
        soldChart = await ChartMongoModel.findById(chartId)
        let findBuyerUser = await UsersMongoModel.findById(userMail)
        buyerUser = findBuyerUser._doc
    }
    catch(err){
        let errorMessage = {error:err, message: 'could not search for requested chart or user'}
        logError.error(errorMessage)
        return errorMessage
    }
    if (buyerUser.email != soldChart.email){
        let errorMessage = {error: true, message: "chart owner and current user dont match"} 
        return errorMessage 
    }
    if (soldChart.purchased){
        let errorMessage = {error: true, message: 'chart has already been purchased.'}
        logError.error(errorMessage)
        return errorMessage
    }
    soldChart.destinyAddress = destiny
    if(paymentSuccessSim(paymentInfo) == false){//Temporary: simulates request to payment api.
        let errorMessage = {error: true, message:"payment failed"}
        return errorMessage
    } 
    soldChart.purchased = true

    //------------Updating databases after payment------------
    await chartUpdater(soldChart)
    let userNewChart = await chartMaker(buyerUser.email)
    let buyerUpdated = {...buyerUser, assignedChartId: userNewChart.doc._id}
    await UsersMongoModel.updateOne({_id:buyerUpdated._id},{
        $set:{
            assignedChartId: buyerUpdated.assignedChartId
        }
    })
    //------------Messaging----------------------
    messaging(soldChart, buyerUser)

    return {message: 'purchase completed successfully', success: soldChart.purchased}
}


module.exports = { chartsLister, chartFinder, chartMaker, chartDeleter, productToChart, productInChartUpdater, chartProductDeleter, chartPurchaser }
