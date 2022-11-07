const { chartMaker, chartFinder, chartDeleter, chartProductDeleter, productInChartUpdater, chartPurchaser  } = require('../services/chartServices.js');

/* -------------Chart Controllers ---------------- */

const createChart = async (req, res) => {
    let response = await chartMaker();
    res.json(response)
}

const getChartProducts =  async (req, res) => {
    let response = await chartFinder(req.params.id);
    response.prods.length == 0 ? res.json ({message: 'chart is empty'}) : 
    res.json(response.prods)
}

const deleteChart = async (req, res) => {
    let response = await chartDeleter(req.params.id)
    res.json(response) 
}

const ProductOntoChart = async (req, res) => {  
    let amount = parseInt(req.query.amount)
    let response = await productInChartUpdater(req.params.id, req.product, amount)
    res.json(response);
}

const deleteChartProduct =  async (req, res) => {
    let response = await chartProductDeleter(req.params.id, req.params.id_prod)
    res.json(response) 
}

const purchaseChart = async (req, res) => {
    //destiny and payment info should be validated through api consulting middleware before this
    let response = await chartPurchaser(req.params.id, req.session.passport.user, req.body.paymentInfo, req.body.destiny)
    res.json(response)
}


module.exports = {createChart, deleteChart, getChartProducts, ProductOntoChart, deleteChartProduct, purchaseChart}

