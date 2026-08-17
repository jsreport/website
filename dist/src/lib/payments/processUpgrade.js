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
exports.processUpgrade = void 0;
const products_1 = __importDefault(require("../../shared/products"));
const logger = __importStar(require("../utils/logger"));
const processUpgrade = (services) => async (customer, product, sale) => {
    const productsThatCanBeUpgraded = customer.products.slice().reverse().filter(p => { var _a; return ((_a = products_1.default[p.code].upgrade) === null || _a === void 0 ? void 0 : _a.code) == product.code; });
    for (const p of productsThatCanBeUpgraded) {
        logger.warn('Performing upgrade ' + customer.email + ' ' + p.id);
        customer.products.find(cp => cp.id === p.id).upgradeDate = new Date();
        await services.notifyLicensingServer(customer, p, sale);
    }
    if (productsThatCanBeUpgraded.length === 0) {
        logger.warn('Unable to find customer product to upgrade for customer ' + customer.email);
    }
};
exports.processUpgrade = processUpgrade;
//# sourceMappingURL=processUpgrade.js.map