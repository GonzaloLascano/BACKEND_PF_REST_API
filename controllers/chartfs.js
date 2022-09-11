const { chartsPath, Chart } = require('../models/fs/chartfs')
let { charts } = require('../models/fs/chartfs')
const { writeFile } = require('../models/fs/utils')

const createChart = (req, res) => {
    let newChart = new Chart(0, Date.now(), [])
    newChart = {...newChart, id: (charts.length === 0 ? 1 : (charts[charts.length - 1].id + 1))}
    charts.push(newChart)
    writeFile(charts, chartsPath)
    res.json({mensaje: `New empty chart created! id: ${newChart.id}`})
}

const deleteChart = (req, res) => {
    charts = charts.filter((chart) => {
        if (chart.id != req.params.id) {
            return chart
        }    
    })
    charts = charts.filter(chart => chart.id !== req.params.id)
   
    writeFile(charts, chartsPath)
    res.json({message: 'chart deleted successfully'})  
    
}

const getChartProducts =  (req, res) => {                           
    if (req.idChart.prods.length > 0) {
        res.json(req.idChart.prods)
    }
    else {res.json('chart is empty')}
}

const addProductToChart = (req, res) => {                         
    charts = charts.map((chart) => {
        if (chart.id == req.params.id){
            chart.prods.push(req.idProduct)
        }
        return chart;
    })
    writeFile(charts, chartsPath)
    res.json({message: 'added ok'})
}

const deleteChartProduct =  (req, res) => {                          
    let modChart = charts.map((idChart) => {
        if (idChart.id == req.params.id){
            idChart.prods = idChart.prods.filter(prod => prod.id != req.params.id_prod)
            return idChart
        }
        return idChart
    })
    if (modChart == charts) {res.json({message: 'no products deleted'})}
    else{
        writeFile(modChart, chartsPath)
        res.json({message:"product deleted successfully from chart"})
    }
}


function middleChartIdentifier (req, res, next) {
    if (req.params.id) {
        let error = {mensaje: 'no charts found'}
        req.idChart = charts.find(chart => chart.id == req.params.id)
        if(req.idChart){
            next()
        }
        else {res.json(error)}
        }
    else {next()}
}

//lector de archivos almacenados para rellenar products y chart (PARA FUTUROS USOS)
/* function middleLoader (req, res, next){
    products = loadFile(productsPath)
    charts = loadFile(chartsPath)
    next()
} */


module.exports = {
    createChart,
    deleteChart,
    getChartProducts,
    addProductToChart,
    deleteChartProduct,
    middleChartIdentifier,       
}