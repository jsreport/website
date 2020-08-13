"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emails_1 = require("./emails");
const utils_1 = require("../utils/utils");
exports.cancelSubscription = (services) => async (customerId, productId) => {
    const customer = await services.customerRepository.find(customerId);
    const product = customer.products.find((p) => p.id === productId);
    product.subscription.state = 'canceled';
    // await services.stripe.cancelSubscription(product.stripe.subscription.id)
    // product.stripe.subscription.status = 'canceled'
    Object.assign(customer.products.find((p) => p.id === productId), product);
    await services.customerRepository.update(customer);
    const mail = product.isSupport ? emails_1.Emails.cancel.support : emails_1.Emails.cancel.enterprise;
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
//# sourceMappingURL=cancelSubscription.js.map