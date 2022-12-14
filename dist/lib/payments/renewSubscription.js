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
exports.renewSubscription = void 0;
const emailProcessor_1 = __importDefault(require("./emailProcessor"));
const products_1 = __importDefault(require("../../shared/products"));
const moment_1 = __importDefault(require("moment"));
const logger = __importStar(require("../utils/logger"));
const renewSubscription = (services) => async (customer, product, paymentIntent) => {
    if (paymentIntent == null) {
        logger.info(`Initiating charge for ${product.name} for ${customer.email} of ${product.accountingData.amount} USD`);
        const stripeCustomer = await services.stripe.findOrCreateCustomer(customer.email);
        paymentIntent = await services.stripe.createConfirmedPaymentIntent(stripeCustomer.id, product.subscription.stripe.paymentMethodId, product.accountingData.amount);
    }
    const sale = await services.customerRepository.createSale(product.accountingData, {
        paymentIntentId: paymentIntent.id,
    });
    await services.renderInvoice(sale);
    product.sales.push(sale);
    product.subscription.plannedCancelation = null;
    product.subscription.nextPayment = product.paymentCycle === 'monthly' ?
        moment_1.default(product.subscription.nextPayment).add(1, 'months').toDate()
        : moment_1.default(product.subscription.nextPayment).add(1, 'years').toDate();
    product.subscription.state = 'active';
    product.subscription.retryPlannedPayment = null;
    await services.customerRepository.update(customer);
    await services.notifyLicensingServer(customer, product, sale);
    if (product.webhook) {
        await services.notifyWebhook(customer, product, 'renewed');
    }
    await emailProcessor_1.default(services.sendEmail, 'recurring', customer, {
        product,
        sale,
        productDefinition: products_1.default[product.code]
    });
    logger.info(`Processing subscription renewal of ${product.name} for ${customer.email} completed`);
};
exports.renewSubscription = renewSubscription;
//# sourceMappingURL=renewSubscription.js.map