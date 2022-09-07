const { log } = require("../log")

const reqLog = (req, res, next) => {
    log.info(`${req.method} Request has been made to ${req.path}`)
    next()
}

module.exports = { reqLog }