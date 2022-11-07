const express = require('express')
const productRouter = express.Router();
const { getProductsM, addProductM, modifyProductM, deleteProductM } = require('../controllers/productCntrl')
const { checkAuthentication, adminAuth } = require('../middleware/auth.js')
const { reqLog } = require('../middleware/reqLog')

productRouter.use('*', reqLog)

productRouter.get('/:code?', getProductsM)// works with '/:id' '/:code' and '?category='
productRouter.post('/', checkAuthentication, adminAuth, addProductM)
productRouter.put('/:id',checkAuthentication, adminAuth, modifyProductM)
productRouter.delete('/:id', checkAuthentication, adminAuth, deleteProductM)

module.exports = productRouter