const { productAdder, productFinder, productsLister, productModifier, productDeleter } = require('../services/productServices.js');

// ----------Product controllers----------- */

const getProductsM = async (req, res) => {
    let response
    if (req.params.code) {
        response = await productFinder(req.params.code);
    }else{
        response = await productsLister(req.query.category);
    }
    res.json(response)
}

const addProductM = async (req, res) => {
    let reqProduct = req.body
    let response = await productAdder(reqProduct)
    res.json(response) 
    
}

const modifyProductM = async (req, res) => {
    let response = await productModifier(req.params.id, req.body)
    res.json(response)
}    

const deleteProductM = async (req, res) => {
    let response = await productDeleter(req.params.id)
    res.json(response);
}

module.exports = {
    getProductsM, addProductM, modifyProductM, deleteProductM,   
}