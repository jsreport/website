"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const emails_1 = require("./emails");
exports.emailVerification = (services) => async (email, productCode) => {
    const stripeCustomer = await services.stripe.findOrCreateCustomer(email.toLowerCase());
    const customer = await services.customerRepository.findOrCreate(email.toLocaleLowerCase(), stripeCustomer.id);
    await services.sendEmail({
        to: customer.email,
        content: utils_1.interpolate(emails_1.Emails.emailVerification.content, { customer, productCode }),
        subject: utils_1.interpolate(emails_1.Emails.emailVerification.subject, { customer, productCode }),
    });
};
//# sourceMappingURL=emailVerification.js.map