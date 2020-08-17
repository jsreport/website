"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger = __importStar(require("../utils/logger"));
exports.updatePaymentMethod = (services, processSuccessfullPayment) => async (customerId, productId, data) => {
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
//# sourceMappingURL=updatePaymentMethod.js.map