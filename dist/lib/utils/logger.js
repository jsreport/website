"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_transport_1 = __importDefault(require("winston-transport"));
const debug_1 = __importDefault(require("debug"));
const winston_loggly_bulk_1 = require("winston-loggly-bulk");
let _logger;
const jsreportdebug = debug_1.default('jsreport');
class DebugTransport extends winston_transport_1.default {
    constructor() {
        super();
        this.name = 'debug';
        this.level = 'debug';
    }
    log(info, callback) {
        setImmediate(() => this.emit('logged', info));
        jsreportdebug(info.level + ' ' + info.message + ' ' + (info.stack || ''));
        callback();
    }
}
exports.init = (loggly = null) => {
    _logger = winston_1.default.createLogger({
        level: 'debug',
        format: winston_1.default.format.simple(),
    });
    _logger.add(new DebugTransport());
    if (loggly) {
        _logger.add(new winston_loggly_bulk_1.Loggly({
            level: loggly.level,
            token: loggly.token,
            subdomain: loggly.subdomain,
            json: true,
            tags: ['website'],
        }));
    }
};
exports.info = (...args) => _logger.info.apply(_logger, args);
exports.debug = (...args) => _logger.debug.apply(_logger, args);
exports.error = (...args) => _logger.error.apply(_logger, args);
exports.warn = (...args) => _logger.warn.apply(_logger, args);
exports.log = (...args) => _logger.log.apply(_logger, args);
//# sourceMappingURL=logger.js.map