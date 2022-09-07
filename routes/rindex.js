const indexRouter = require('express').Router();
const productRouter = require('./product');
const chartRouter = require('./chart');
const userRouter = require('./users')

indexRouter.use('/api/productos', productRouter)
indexRouter.use('/api/carrito', chartRouter)
indexRouter.use('/users', userRouter)

module.exports = indexRouter