const express = require('express')
const productRouter = express.Router();
const { getProducts, addProduct, modifyProduct, deleteProduct, middleIdentifier, middleAdminSim } = require('../controllers/productfs')
const { getProductsM, addProductM, modifyProductM, deleteProductM } = require('../controllers/ProductMongo')
const { checkAuthentication } = require('../middleware/auth.js')


/* fs endpoints */
/* productRouter.get('/:id?', middleIdentifier, getProducts) */
/* productRouter.post('/', middleAdminSim, addProduct) */
/* productRouter.put('/:id', middleAdminSim,  middleIdentifier, modifyProduct) */
/* productRouter.delete('/:id', middleAdminSim, middleIdentifier, deleteProduct) */

/* Mongo db endpoints */
productRouter.get('/:id?', checkAuthentication, getProductsM)
productRouter.post('/', checkAuthentication, middleAdminSim, addProductM)
productRouter.put('/:id', checkAuthentication, middleAdminSim, modifyProductM)
productRouter.delete('/:id', checkAuthentication, middleAdminSim, deleteProductM)

module.exports = productRouter