"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger = __importStar(require("../utils/logger"));
const util_1 = require("util");
const validate_vat_1 = __importDefault(require("validate-vat"));
const validateVatUtil = util_1.promisify(validate_vat_1.default);
async function default_1(vatNumber = '') {
    logger.debug('validating vat ' + vatNumber);
    const r = await validateVatUtil(vatNumber.slice(0, 2), vatNumber.substring(2));
    if (r.valid !== true) {
        throw new Error('Invalid VAT');
    }
    return {
        country: r.countryCode,
        name: r.name,
        address: r.address
    };
}
exports.default = default_1;
//# sourceMappingURL=validateVat.js.map