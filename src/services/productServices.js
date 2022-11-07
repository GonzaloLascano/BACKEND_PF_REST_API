const mongoose = require('mongoose');
const { logError, log, logWarn } = require('../../config/log.js');
const { ProdMongoModel, } = require('../models/productsModel');

const productsLister = async (data) => {
    let response
    try{
        if (data){
            response = await ProdMongoModel.find({category: data});
        } else {
            response = await ProdMongoModel.find();
        }
    } catch(error) {
        let errormessage = {error: true, message: 'query to db failed'}
        logError.error(errormessage)
        return errormessage
    }
    response.length === 0 ? response = {notFound: true, message: 'no products found'} : response;
    return response
}

const productFinder = async (requestedProduct) => {
    let response
    try {
        try{
            response = await ProdMongoModel.findOne({_id: requestedProduct});
        }
        catch (error){
            response = await ProdMongoModel.findOne({code: requestedProduct});
            log.info('product found by code instead of _id ')
        }
    }catch (err) {
        let errorMessage = 'could not search requested product on db';
        response = {message: errorMessage, error: err}
        logError.error(response)
    }
    if (response === null) {
        response = {message: 'product wasnt found', notFound: true, error: true}
        logWarn.warn(response)
    }
    return response
}

const productAdder = async (prodToAdd) => {
    let response = productFinder(prodToAdd.code)
    if (response.found) {
        try{ 
            response = await ProdMongoModel.create({...prodToAdd})
            log.info(response + 'product was added to DB')
            response = {doc: response._doc, message: `product added successfully`}   
        }catch(err){
            response = {message: 'could not add requested product to db', error: err}
            logError.error(response);
        }
    } 
    return response
}

const productModifier = async (requestedProduct, changes) => {
    let response;
    try{
        response = await ProdMongoModel.updateOne(
            {_id: requestedProduct}, 
            {$set:{
                ...changes
                }
            },
            {runValidators: true}
        );
        response = {...response, message:'Product successfully modified!'}
        log.info(response);
    } catch(err) {
        response = {error: err, message: 'unable to modify product'}
        logError.error(response);
    }
    return response
}

const productDeleter = async (requestedProduct) => {
    let response;
    try {
        response = await ProdMongoModel.deleteOne({_id: requestedProduct})
        response = {...response, mensaje: 'product successfully deleted'}    
        log.info(response)
    } catch(err) {
        response = {message: 'unable to delete product', error: err}
        logError.error(response);
    }
    return response
}

const stockChecker = async (amount, productRef)=>{
    log.info('verifying stock')
    let requestedProduct = await productFinder(productRef)
    if (requestedProduct.notFound) {
        return requestedProduct
    }
    if (requestedProduct.stock < amount) {
        let responseMessage = {error: true, message: 'not enough stock'}
        logError.error(responseMessage)
        return requestedProduct = responseMessage
    }
    return requestedProduct
}

module.exports = { productAdder, productFinder, productsLister, productModifier, productDeleter, stockChecker }