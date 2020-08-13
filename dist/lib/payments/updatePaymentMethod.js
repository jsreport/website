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
exports.updatePaymentMethod = (services) => async (customerId, productId, si) => {
    logger.info(`updating patyment method for customer: ${customerId}, productId: ${productId}`);
    const customer = await services.customerRepository.find(customerId);
    const product = customer.products.find((p) => p.id === productId);
    const stripeCustomer = await services.stripe.findOrCreateCustomer(customer.email);
    product.stripe.subscription = await services.stripe.updateSubscription(product.stripe.subscription.id, stripeCustomer.id, si.payment_method);
    Object.assign(customer.products.find((p) => p.id === productId), product);
    await services.customerRepository.update(customer);
};
//# sourceMappingURL=updatePaymentMethod.js.map