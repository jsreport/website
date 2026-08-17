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
        product.subscription.stripe.paymentMethodId = stripePaymentMethod.id;
        console.log('product', product);
        return processSuccessfullPayment(customer, product, stripePaymentIntent);
    }
};
exports.updatePaymentMethod = updatePaymentMethod;
//# sourceMappingURL=updatePaymentMethod.js.map