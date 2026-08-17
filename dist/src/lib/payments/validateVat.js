"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const logger = __importStar(require("../utils/logger"));
const util_1 = require("util");
const validate_vat_1 = __importDefault(require("validate-vat"));
const unescape_1 = __importDefault(require("unescape"));
const validateVatUtil = (0, util_1.promisify)(validate_vat_1.default);
async function test(vatNumber) {
    const r = await validateVatUtil(vatNumber.slice(0, 2), vatNumber.substring(2));
    if (r.valid !== true) {
        throw new Error('Invalid VAT: ' + r);
    }
    return {
        country: r.countryCode === 'EL' ? 'GR' : r.countryCode,
        name: (0, unescape_1.default)(r.name),
        address: (0, unescape_1.default)(r.address)
    };
}
async function default_1(vatNumber = '') {
    logger.debug('validating vat ' + vatNumber);
    let lastE;
    for (let i = 0; i < 5; i++) {
        try {
            return await test(vatNumber);
        }
        catch (e) {
            lastE = e;
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    throw lastE;
}
//# sourceMappingURL=validateVat.js.map