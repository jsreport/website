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
const mailer_1 = require("../utils/mailer");
const stripe_1 = __importDefault(require("./stripe"));
const customer_1 = require("./customer");
const validateVat_1 = __importDefault(require("./validateVat"));
const checkout_1 = require("./checkout");
const notifyLicensingServer_1 = require("./notifyLicensingServer");
const updatePaymentMethod_1 = require("./updatePaymentMethod");
const cancelSubscription_1 = require("./cancelSubscription");
const renderInvoice_1 = require("./renderInvoice");
const sendCustomerLink_1 = require("./sendCustomerLink");
const stripeHook_1 = require("./stripeHook");
class Payments {
    constructor(db) {
        this.db = db;
        this.customerRepository = new customer_1.CustomerRepository(db);
        this.services = {
            customerRepository: this.customerRepository,
            stripe: new stripe_1.default(),
            sendEmail: mailer_1.sendEmail,
            notifyLicensingServer: notifyLicensingServer_1.notifyLicensingServer,
            renderInvoice: renderInvoice_1.renderInvoice,
        };
    }
    async init() { }
    createPaymentIntent({ amount, email }) {
        return this.services.stripe.createPaymentIntent({
            amount: amount * 100,
            email,
        });
    }
    async validateVat(vatNumber = '') {
        return validateVat_1.default(vatNumber);
    }
    async checkout(checkoutData) {
        return checkout_1.checkout(this.services)(checkoutData);
    }
    async updatePaymentMethod(customerId, productId, si) {
        return updatePaymentMethod_1.updatePaymentMethod(this.services)(customerId, productId, si);
    }
    async customer(id) {
        return this.customerRepository.find(id);
    }
    async invoice(customerId, saleId) {
        logger.info('Downloading invoice ' + saleId);
        const sale = await this.customerRepository.findSale(customerId, saleId);
        return renderInvoice_1.readInvoice(sale.blobName);
    }
    async cancelSubscription(customerId, productId) {
        logger.info('Canceling subscription customerId:' + customerId + ' productId:' + productId);
        return cancelSubscription_1.cancelSubscription(this.services)(customerId, productId);
    }
    stripeHook(signature, body) {
        logger.info('Parsing stripe hook');
        return stripeHook_1.stripeHook(this.services)(signature, body);
    }
    customerLink(email) {
        logger.info('Request customer link ' + email);
        return sendCustomerLink_1.sendCustomerLink(this.services)(email);
    }
}
exports.default = Payments;
//# sourceMappingURL=payments.js.map