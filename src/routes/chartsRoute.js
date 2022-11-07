const chartRouter = require('express').Router();
const { createChart, deleteChart, getChartProducts, ProductOntoChart, deleteChartProduct, purchaseChart } = require('../controllers/chartCntrl')
const { stockCheck } = require('../middleware/stock.js')
const { reqLog } = require('../middleware/reqLog');
const { adminAuth, checkAuthentication } = require('../middleware/auth');

chartRouter.use('*', reqLog)

chartRouter.get('/:id/productos', checkAuthentication, getChartProducts)
chartRouter.post('/', checkAuthentication, adminAuth, createChart)//here ONLY FOR ACADEMIC PURPOSES 
//the chart is created when asignated to a new user when registered or when previous chart is purchased successfully.
chartRouter.post('/:id/productos/:code',checkAuthentication, stockCheck, ProductOntoChart)
chartRouter.delete('/:id', checkAuthentication, adminAuth, deleteChart)
chartRouter.delete('/:id/productos/:id_prod', checkAuthentication, deleteChartProduct)

chartRouter.post('/:id/purchase', checkAuthentication, purchaseChart)

module.exports = chartRouter