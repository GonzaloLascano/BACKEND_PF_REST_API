const chartRouter = require('express').Router();
const { createChart, deleteChart, getChartProducts, addProductToChart, deleteChartProduct, middleChartIdentifier } = require('../controllers/chartfs')
const { prodToChartVerif } = require('../controllers/productfs')
const { createChartM, deleteChartM, getChartProductsM, addProductToChartM, deleteChartProductM, purchaseChart } = require('../controllers/chartMongo')
const { checkAuthentication } = require('../middleware/auth');
const { reqLog } = require('../middleware/reqLog');


/* fs chart endpoints */

/* chartRouter.post('/', createChart) */
/* chartRouter.delete('/:id', deleteChart) */
/* chartRouter.get('/:id/productos', middleChartIdentifier, getChartProducts) */
/* chartRouter.post('/:id/productos/:id_prod', middleChartIdentifier, prodToChartVerif, addProductToChart) */
/* chartRouter.delete('/:id/productos/:id_prod', middleChartIdentifier, deleteChartProduct) */

/* Mongodb chart endpoints */

//Crear middleware para verificar si el usuario es administrador y otorgar permisos. (actualizar modelo de UserMongo con ese parametro)
chartRouter.post('/',  reqLog, checkAuthentication, createChartM)
chartRouter.delete('/:id',  reqLog, checkAuthentication, deleteChartM)
chartRouter.get('/:id/productos',  reqLog, checkAuthentication, getChartProductsM)
chartRouter.post('/:id/productos/:id_prod',  reqLog, checkAuthentication, addProductToChartM)
chartRouter.delete('/:id/productos/:id_prod',  reqLog, checkAuthentication, deleteChartProductM)

chartRouter.post('/:id/purchase', reqLog, checkAuthentication, purchaseChart)




module.exports = chartRouter