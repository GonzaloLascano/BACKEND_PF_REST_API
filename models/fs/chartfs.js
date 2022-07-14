const { loadFile } = require('./utils')

let charts = []
let chartsPath = './memory/charts.txt'

class Chart {
    constructor(id, time, prods) {
        this.id = id
        this.time = time
        this.prods = prods
    }
}

charts = loadFile(chartsPath)

module.exports = {
    charts, chartsPath, Chart
}