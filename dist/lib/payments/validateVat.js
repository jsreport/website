"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger = __importStar(require("../utils/logger"));
const util_1 = require("util");
const validate_vat_1 = __importDefault(require("validate-vat"));
const unescape_1 = __importDefault(require("unescape"));
const validateVatUtil = util_1.promisify(validate_vat_1.default);
async function default_1(vatNumber = '') {
    logger.debug('validating vat ' + vatNumber);
    try {
        const r = await validateVatUtil(vatNumber.slice(0, 2), vatNumber.substring(2));
        if (r.valid !== true) {
            throw new Error('Invalid VAT');
        }
        return {
            country: r.countryCode,
            name: unescape_1.default(r.name),
            address: unescape_1.default(r.address)
        };
    }
    finally {
        logger.debug('vat validation finished');
    }
}
exports.default = default_1;
//# sourceMappingURL=validateVat.js.map