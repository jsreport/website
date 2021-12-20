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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentMethod = void 0;
const logger = __importStar(require("../utils/logger"));
const updatePaymentMethod = (services, processSuccessfullPayment) => async (customerId, productId, data) => {
    const customer = await services.customerRepository.find(customerId);
    const product = customer.products.find((p) => p.id === productId);
    if (data.setupIntentId) {
        logger.info(`updating payment method for customer: ${customer.email}`);
        const stripeSetupIntent = await services.stripe.findSetupIntent(data.setupIntentId);
        const stripePaymentMethod = stripeSetupIntent.payment_method;
        product.subscription.card = {
            last4: stripePaymentMethod.card.last4,
            expMonth: stripePaymentMethod.card.exp_month,
            expYear: stripePaymentMethod.card.exp_year,
        };
        product.subscription.stripe.paymentMethodId = stripePaymentMethod.id;
        await services.customerRepository.update(customer);
        logger.info(`updating payment method for customer: ${customer.email} successfull`);
    }
    else {
        logger.info(`updating payment method for customer: ${customer.email} as immediate charge confirmation`);
        const stripePaymentIntent = await services.stripe.findPaymentIntent(data.paymentIntentId);
        const stripePaymentMethod = stripePaymentIntent.payment_method;
        product.subscription.card = {
            last4: stripePaymentMethod.card.last4,
            expMonth: stripePaymentMethod.card.exp_month,
            expYear: stripePaymentMethod.card.exp_year,
        };
        return processSuccessfullPayment(customer, product, stripePaymentIntent);
    }
};
exports.updatePaymentMethod = updatePaymentMethod;
//# sourceMappingURL=updatePaymentMethod.js.map