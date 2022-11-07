const indexRouter = require('express').Router();
const productRouter = require('./productsRoute');
const chartRouter = require('./chartsRoute');
const userRouter = require('./usersRoute');

/* ----- Index Route ----- */

indexRouter.use('/api/productos', productRouter)
indexRouter.use('/api/carrito', chartRouter)
indexRouter.use('/users', userRouter)

module.exports = indexRouter