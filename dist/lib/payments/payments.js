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
const mailer_1 = require("../utils/mailer");
const stripe_1 = __importDefault(require("./stripe"));
const customer_1 = require("./customer");
const validateVat_1 = __importDefault(require("./validateVat"));
const checkout_1 = require("./checkout");
const notifyLicensingServer_1 = require("./notifyLicensingServer");
const notifyWebhook_1 = require("./notifyWebhook");
const updatePaymentMethod_1 = require("./updatePaymentMethod");
const cancelSubscription_1 = require("./cancelSubscription");
const renderInvoice_1 = require("./renderInvoice");
const sendCustomerLink_1 = require("./sendCustomerLink");
const subscriptionRenewal_1 = __importDefault(require("./subscriptionRenewal"));
const emailVerification_1 = require("./emailVerification");
const taxes_js_1 = require("./taxes/taxes.js");
class Payments {
    constructor(db) {
        this.db = db;
        this.customerRepository = new customer_1.CustomerRepository(db);
        this.services = {
            customerRepository: this.customerRepository,
            stripe: new stripe_1.default(),
            sendEmail: mailer_1.sendEmail,
            notifyLicensingServer: notifyLicensingServer_1.notifyLicensingServer,
            notifyWebhook: notifyWebhook_1.notifyWebhook,
            renderInvoice: renderInvoice_1.renderInvoice,
            readInvoice: renderInvoice_1.readInvoice
        };
        this.subscriptionRenewal = new subscriptionRenewal_1.default(this.services);
    }
    async init() {
        this.subscriptionRenewal.start();
    }
    async createPaymentIntent({ amount, customerId }) {
        const customer = await this.services.customerRepository.find(customerId);
        return {
            intent: await this.services.stripe.createPaymentIntent({
                amount: amount,
                email: customer.email,
            })
        };
    }
    async createSetupIntent({ customerId }) {
        const customer = await this.services.customerRepository.find(customerId);
        return {
            intent: await this.services.stripe.createSetupIntent({ email: customer.email })
        };
    }
    async validateVat(vatNumber = '') {
        return validateVat_1.default(vatNumber);
    }
    async checkout(checkoutData) {
        return checkout_1.checkout(this.services)(checkoutData);
    }
    async updatePaymentMethod(customerId, productId, si) {
        return updatePaymentMethod_1.updatePaymentMethod(this.services, this.subscriptionRenewal.processSucesfullPayment.bind(this.subscriptionRenewal))(customerId, productId, si);
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
    customerLink(email) {
        logger.info('Request customer link ' + email);
        return sendCustomerLink_1.sendCustomerLink(this.services)(email);
    }
    async stripeHook() {
        // nothing for now
    }
    emailVerification(email, productCode) {
        return emailVerification_1.emailVerification(this.services)(email, productCode);
    }
    createTaxes(data) {
        return taxes_js_1.createTaxes(this.services)(data);
    }
}
exports.default = Payments;
//# sourceMappingURL=payments.js.map