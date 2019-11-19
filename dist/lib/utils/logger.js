"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require('winston');
const Loggly = require('winston-loggly-bulk').Loggly;
let _logger;
exports.init = (loggly = null) => {
    _logger = winston.createLogger({
        level: 'debug',
        format: winston.format.simple()
    });
    _logger.add(new winston.transports.Console(), {
        level: 'debug'
    });
    if (loggly) {
        _logger.add(new Loggly({
            level: loggly.level,
            token: loggly.token,
            subdomain: loggly.subdomain,
            json: true,
            tags: ['website']
        }));
    }
};
exports.info = (...args) => _logger.info.apply(_logger, args);
exports.debug = (...args) => _logger.debug.apply(_logger, args);
exports.error = (...args) => _logger.error.apply(_logger, args);
exports.warn = (...args) => _logger.warn.apply(_logger, args);
exports.log = (...args) => _logger.log.apply(_logger, args);
//# sourceMappingURL=logger.js.map