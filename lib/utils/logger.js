const winston = require('winston')

require('winston-loggly')

let logger

module.exports = {
  debug: (...args) => logger.debug.apply(logger, args),
  info: (...args) => logger.info.apply(logger, args),
  error: (...args) => logger.error.apply(logger, args),
  warn: (...args) => logger.warn.apply(logger, args),
  log: (...args) => logger.log.apply(logger, args)
}

module.exports.init = ({ loggly } = {}) => {
  logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple()
  })

  logger.add(new winston.transports.Console(), {
    level: 'debug'
  })

  if (loggly) {
    logger.add(new winston.transports.Loggly(), {
      level: loggly.level,
      token: loggly.token,
      subdomain: loggly.subdomain,
      json: true,
      tags: ['website']
    })
  }
}
