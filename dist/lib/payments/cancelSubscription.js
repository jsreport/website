"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSubscription = void 0;
const emails_1 = require("./emails");
const utils_1 = require("../utils/utils");
const cancelSubscription = (services) => async (customerId, productId) => {
    const customer = await services.customerRepository.find(customerId);
    const product = customer.products.find((p) => p.id === productId);
    product.subscription.state = 'canceled';
    product.subscription.nextPayment = null;
    product.subscription.retryPlannedPayment = null;
    product.subscription.plannedCancelation = null;
    Object.assign(customer.products.find((p) => p.id === productId), product);
    await services.customerRepository.update(customer);
    const mail = product.licenseKey ? emails_1.Emails.cancel.enterprise : emails_1.Emails.cancel.custom;
    await services.sendEmail({
        to: customer.email,
        content: utils_1.interpolate(mail.customer.content, { customer, product }),
        subject: utils_1.interpolate(mail.customer.subject, { customer, product }),
    });
    await services.sendEmail({
        to: 'jan.blaha@jsreport.net',
        content: utils_1.interpolate(mail.us.content, { customer, product }),
        subject: utils_1.interpolate(mail.us.subject, { customer, product }),
    });
};
exports.cancelSubscription = cancelSubscription;
//# sourceMappingURL=cancelSubscription.js.map