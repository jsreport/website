import winston from 'winston'
import Transport from 'winston-transport'
import Debug from 'debug'
import { Loggly } from 'winston-loggly-bulk'

let _logger

const jsreportdebug = Debug('jsreport')

class DebugTransport extends Transport {
  name
  level

  constructor() {
    super()
    this.name = 'debug'
    this.level = 'debug'
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info))
    jsreportdebug(info.level + ' ' + info.message + ' ' + (info.stack || ''))
    callback()
  }
}

export let init = (loggly = null) => {
  _logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
  })

  _logger.add(new DebugTransport())

  if (loggly) {
    _logger.add(
      new Loggly({
        level: loggly.level,
        token: loggly.token,
        subdomain: loggly.subdomain,
        json: true,
        tags: ['website'],
      })
    )
  }
}

export let info = (...args) => _logger.info.apply(_logger, args)
export let debug = (...args) => _logger.debug.apply(_logger, args)
export let error = (...args) => _logger.error.apply(_logger, args)
export let warn = (...args) => _logger.warn.apply(_logger, args)
export let log = (...args) => _logger.log.apply(_logger, args)
