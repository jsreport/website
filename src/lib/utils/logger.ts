const winston = require('winston')
require('winston-loggly')


let _logger

export let init = ({ loggly = null } = {}) => {
  _logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple()
  })

  _logger.add(new winston.transports.Console(), {
    level: 'debug'
  })

  if (loggly) {
    _logger.add(new winston.transports.Loggly(), {
      level: loggly.level,
      token: loggly.token,
      subdomain: loggly.subdomain,
      json: true,
      tags: ['website']
    })
  }
}


export let info = (...args) => _logger.info.apply(_logger, args)
export let debug = (...args) => _logger.debug.apply(_logger, args)
export let error = (...args) => _logger.error.apply(_logger, args)
export let warn = (...args) => _logger.warn.apply(_logger, args)
export let log = (...args) => _logger.log.apply(_logger, args)


