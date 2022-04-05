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
async function loadFiles(object, path){
    try{
        object = await fs.promises.readFile(path, 'utf-8')
    }
    catch (err){
        console.log('could not read file! ' + err)
    }
}

async function writeFile(object, path){
    try{
        await fs.promises.writeFile(path, JSON.stringify(object))
    }
    catch (err){
        console.log('could not write file! ' + err)
    }
}

