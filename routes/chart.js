const chartRouter = require('express').Router();
const { createChart, deleteChart, getChartProducts, addProductToChart, deleteChartProduct, middleChartIdentifier } = require('../controllers/chartfs')
const { prodToChartVerif } = require('../controllers/productfs')
const { createChartM, deleteChartM, getChartProductsM, addProductToChartM, deleteChartProductM } = require('../controllers/chartMongo')
const { checkAuthentication } = require('../middleware/auth')


/* fs chart endpoints */

/* chartRouter.post('/', createChart) */
/* chartRouter.delete('/:id', deleteChart) */
/* chartRouter.get('/:id/productos', middleChartIdentifier, getChartProducts) */
/* chartRouter.post('/:id/productos/:id_prod', middleChartIdentifier, prodToChartVerif, addProductToChart) */
/* chartRouter.delete('/:id/productos/:id_prod', middleChartIdentifier, deleteChartProduct) */

/* Mongodb chart endpoints */

chartRouter.post('/', createChartM)
chartRouter.delete('/:id', deleteChartM)
chartRouter.get('/:id/productos', getChartProductsM)
chartRouter.post('/:id/productos/:id_prod', addProductToChartM)
chartRouter.delete('/:id/productos/:id_prod', deleteChartProductM)

chartRouter.post('/id/purchase', checkAuthentication, purchaseChart)




module.exports = chartRouter