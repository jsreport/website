"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyLicensingServer = void 0;
const axios_1 = __importDefault(require("axios"));
const notifyLicensingServer = function (customer, product, sale) {
    return axios_1.default.post('https://jsreportonline.net/gumroad-hook', {
        email: customer.email,
        purchaseDate: new Date(),
        license_key: product.licenseKey,
        braintreeSale: {
            productId: product.id,
            saleId: sale.id,
            customerId: customer.uuid
        },
        product_name: product.name,
        permalink: product.permalink
    });
};
exports.notifyLicensingServer = notifyLicensingServer;
//# sourceMappingURL=notifyLicensingServer.js.map