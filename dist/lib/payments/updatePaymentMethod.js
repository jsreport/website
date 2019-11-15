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
exports.updatePaymentMethod = (services) => async (customerId, productId, nonce) => {
    logger.info(`updating patyment method for customer: ${customerId}, productId: ${productId}`);
    const customer = await services.customerRepository.find(customerId);
    const product = customer.products.find(p => p.id === productId);
    const pmr = await services.braintree.createPaymentMethod({
        customerId: customer.braintree.customerId,
        paymentMethodNonce: nonce,
        options: {
            verifyCard: true
        }
    });
    if (pmr.success === false) {
        throw new Error('Unable to register payment method: ' + pmr.message);
    }
    const sres = await services.braintree.updateSubscription(product.braintree.subscription.id, {
        paymentMethodToken: pmr.paymentMethod.token,
        id: product.braintree.subscription.id,
        merchantAccountId: product.braintree.subscription.merchantAccountId,
        planId: product.braintree.subscription.planId
    });
    if (sres.success === false) {
        throw new Error('Unable to udpdate payment ' + sres.message);
    }
    product.braintree.paymentMethod = pmr.paymentMethod;
    Object.assign(customer.products.find(p => p.id === productId), product);
    await services.customerRepository.update(customer);
};
//# sourceMappingURL=updatePaymentMethod.js.map