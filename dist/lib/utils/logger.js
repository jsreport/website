"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.warn = exports.error = exports.debug = exports.info = exports.init = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_loggly_bulk_1 = require("winston-loggly-bulk");
let _logger;
let init = (loggly = null) => {
    _logger = winston_1.default.createLogger({
        level: 'debug',
        format: winston_1.default.format.simple(),
    });
    _logger.add(new winston_1.default.transports.Console());
    if (loggly && loggly.subdomain) {
        _logger.add(new winston_loggly_bulk_1.Loggly({
            level: loggly.level,
            token: loggly.token,
            subdomain: loggly.subdomain,
            json: true,
            tags: [process.env.LOGGLY_TAG],
        }));
    }
    _logger.info('logger initialized');
};
exports.init = init;
let info = (...args) => _logger.info.apply(_logger, args);
exports.info = info;
let debug = (...args) => _logger.debug.apply(_logger, args);
exports.debug = debug;
let error = (...args) => _logger.error.apply(_logger, args);
exports.error = error;
let warn = (...args) => _logger.warn.apply(_logger, args);
exports.warn = warn;
let log = (...args) => _logger.log.apply(_logger, args);
exports.log = log;
//# sourceMappingURL=logger.js.map