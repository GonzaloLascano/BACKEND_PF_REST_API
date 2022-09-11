
// identificador de producto por ID en caso de existir el parametro
function middleIdentifier (req, res, next) {
    let error = {mensaje: 'Product not found'}
    req.idProduct = products.find(product => product.id == req.params.id)
    //if (req.params.id === undefined) {res.json(products)}
    //else 
    if (req.idProduct || (req.params.id === undefined)) {
        next()
    }
    else {res.json(error)}
}

function prodToChartVerif (req, res, next) {
    let error = {mensaje: 'Product not found'}
    req.idProduct = products.find(product => product.id == req.params.id_prod)
    if(req.idProduct){
        next()
    }
    else {res.json(error)}
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

//simulador de permiso de administrador
function middleAdminSim (req, res, next) {
    req.query.admin == 1 ? next() : res.send('Access denied. Unauthorized request or route.')
}

module.exports = {
    middleIdentifier, prodToChartVerif, middleChartIdentifier, middleAdminSim
}