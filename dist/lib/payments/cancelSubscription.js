"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSubscription = void 0;
const emailProcessor_1 = __importDefault(require("./emailProcessor"));
const products_1 = __importDefault(require("../../shared/products"));
const cancelSubscription = (services) => async (customerId, productId) => {
    const customer = await services.customerRepository.find(customerId);
    const product = customer.products.find((p) => p.id === productId);
    await emailProcessor_1.default(services.sendEmail, 'cancel', customer, {
        product,
        productDefinition: products_1.default[product.code]
    });
    product.subscription.state = 'canceled';
    product.subscription.nextPayment = null;
    product.subscription.retryPlannedPayment = null;
    product.subscription.plannedCancelation = null;
    Object.assign(customer.products.find((p) => p.id === productId), product);
    await services.customerRepository.update(customer);
    if (product.webhook) {
        await services.notifyWebhook(customer, product, 'canceled');
    }
};
exports.cancelSubscription = cancelSubscription;
//# sourceMappingURL=cancelSubscription.js.map