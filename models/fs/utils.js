const fs = require('fs')

/* File System functions. */
function loadFile(path) {
    try{
        return JSON.parse(fs.readFileSync(path, 'utf-8'))
    }
    catch (err){
        console.log('could not read file! ' + err)
        return []
    }
}

async function writeFile(object, path) {
    try{
        await fs.promises.writeFile(path, JSON.stringify(object))
    }
    catch (err){
        console.log('could not write file! ' + err)
    }
}

module.exports = {
    loadFile, writeFile
}