const { stockChecker } = require ('../services/productServices.js');
const { logError, log } = require('../../config/log.js');

const stockCheck = async ( req, res, next ) => {
    let amount = parseInt(req.query.amount)
    if(req.query.amount <= 0) {
        let errorMessage = {error: true, message:'amount must be higher than 0'}
        logError.error(errorMessage)
        res.json(errorMessage)  
    }else{
        req.product = await stockChecker(amount, req.params.code)
        req.product.error ? res.json(req.product) : next()   
    };
}

/* If there were middleware that modifies the stock for the products inside the chart. 
Before and After payment is successfull, it goes here. */

module.exports = { stockCheck }