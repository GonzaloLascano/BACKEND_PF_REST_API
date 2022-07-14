const express = require('express')
const productRouter = express.Router();
const { getProducts, addProduct, modifyProduct, deleteProduct, middleIdentifier, middleAdminSim } = require('../controllers/productfs')
const { getProductsM, addProductM, modifyProductM, deleteProductM } = require('../controllers/ProductMongo')


/* fs endpoints */
/* productRouter.get('/:id?', middleIdentifier, getProducts) */
/* productRouter.post('/', middleAdminSim, addProduct) */
/* productRouter.put('/:id', middleAdminSim,  middleIdentifier, modifyProduct) */
/* productRouter.delete('/:id', middleAdminSim, middleIdentifier, deleteProduct) */

/* Mongo db endpoints */
productRouter.get('/:id?', getProductsM)
productRouter.post('/', middleAdminSim, addProductM)
productRouter.put('/:id', middleAdminSim, modifyProductM)
productRouter.delete('/:id', middleAdminSim, deleteProductM)

module.exports = productRouter