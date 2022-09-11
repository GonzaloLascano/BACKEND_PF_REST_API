const { log } = require('../config/log.js');

const reqLog = (req, res, next) => {
    log.info(`${req.method} Request has been made to ${req.path}`)
    next()
}

module.exports = { reqLog }