"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactivateSubscription = void 0;
const emailProcessor_1 = __importDefault(require("./emailProcessor"));
const products_1 = __importDefault(require("../../shared/products"));
const reactivateSubscription = (services) => async (customerId, productId) => {
    const customer = await services.customerRepository.find(customerId);
    const product = customer.products.find((p) => p.id === productId);
    await emailProcessor_1.default(services.sendEmail, 'recurring', customer, {
        product,
        sale,
        productDefinition: products_1.default[product.code]
    });
    await services.customerRepository.update(customer);
    if (product.webhook) {
        await services.notifyWebhook(customer, product, 'canceled');
    }
};
exports.reactivateSubscription = reactivateSubscription;
//# sourceMappingURL=reactivateSubscription.js.map