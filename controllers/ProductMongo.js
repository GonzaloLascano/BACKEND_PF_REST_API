/* controlador de productos de Mongo */
const { response } = require('express');
const mongoose = require('mongoose');
const { logError, log, logWarn } = require('../log');
const { ProdMongoModel, } = require('../models/db/productsMongo');

const getProductsM = async (req, res) => {
    let dataToSend = {
        user: req.session.passport.user
    }
    if (req.params.id) {
        try {
            let idProduct = await ProdMongoModel.findOne({ prodId: req.params.id })
            log.info(idProduct)
            idProduct === null ? idProduct = 'product not found' : idProduct;
            dataToSend.products = idProduct
        }
        catch(err){
            logError.error(err);
            dataToSend.products = 'product not found'
        }
        
    } else {
        let mongoProds = await ProdMongoModel.find();
        mongoProds.length === 0 ? mongoProds = 'no products found' : mongoProds;
        dataToSend.products = mongoProds
    }
    log.info(dataToSend)
    res.render('lista', { dataToSend } )
}

const addProductM = async (req, res) => {
    try{
        let reqProd = req.body
        const idCount = await ProdMongoModel.findOne({}, {prodId:1}).sort({prodId: -1}); 
        const response = await ProdMongoModel.create({
            prodId: idCount == null ? 1 : idCount.prodId +1,
            timestamp: Date.now(), 
            name: reqProd.name,
            description: reqProd.description,
            code: reqProd.code,
            photo: reqProd.photo,
            price: parseInt(reqProd.price),
            stock: parseInt(reqProd.stock)
        })
        console.log(response)

        res.json({mensaje: `You have successfully added new product: ${response.name}, id: ${response.id} with the price of $${response.price}`})
    
    } catch(err){
        console.log(err);
        res.json({mensaje: 'could not add requested product'})
    }
    
}

const modifyProductM = async (req, res) => {
    try{
        const response = await ProdMongoModel.updateOne({prodId: req.params.id}, {$set:{...req.body, price: parseInt(req.body.price), stock: parseInt(req.body.stock)}});
        console.log(response);
        res.json({mensaje: 'Product successfully modified!'})

    } catch(err) {
        console.log(err);
        res.json({mensaje: 'unable to modify product'})
    }
}    


const deleteProductM = async (req, res) => {
    try {
        const response = await ProdMongoModel.deleteOne({prodId: req.params.id})
        console.log(response)
        res.json({mensaje: 'product successfully deleted'})    
    } catch(err) {
        console.log(err);
        res.json({mensaje: 'unable to modify product'})
    }
}

//simulador de permiso de administrador
 function middleAdminSim (req, res, next) {
    req.query.admin == 1 ? next() : res.send('Access denied. Unauthorized request or route.')
}

module.exports = {
    getProductsM,  addProductM, modifyProductM, deleteProductM, middleAdminSim    
}