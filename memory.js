const fs = require('fs')

const products = []
let productsPath = './memory/products.txt'
const charts = []
let chartsPath = './memory/charts.txt'

class Chart {
    constructor(id, time, prods) {
        this.id = id
        this.time = time
        this.prods = prods
    }
}

/* File System functions. */
async function loadProds(){
    try{
        products = await fs.promises.readFile(productsPath, 'utf-8')
    }
    catch (err){
        console.log('could not read products file! ' + err)
    }
}

async function loadCharts(){
    try{
        charts = await fs.promises.readFile(chartsPath, 'utf-8')
    }
    catch (err){
        console.log('could not read charts file! ' + err)
    }
}

async function writeProds(){
    try{
        await fs.promises.writeFile(productsPath, JSON.stringify(products))
    }
    catch (err){
        console.log('could not write product file! ' + err)
    }
}