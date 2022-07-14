const indexRouter = require('express').Router();
const productRouter = require('./product');
const chartRouter = require('./chart');

indexRouter.use('/api/productos', productRouter)
indexRouter.use('/api/carrito', chartRouter)

module.exports = indexRouter