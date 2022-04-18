"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerification = void 0;
const utils_1 = require("../utils/utils");
const emails_1 = require("./emails");
const emailVerification = (services) => async (email, productCode) => {
    const stripeCustomer = await services.stripe.findOrCreateCustomer(email.toLowerCase());
    const customer = await services.customerRepository.findOrCreate(email.toLocaleLowerCase());
    await services.sendEmail({
        to: customer.email,
        content: utils_1.interpolate(emails_1.Emails.emailVerification.content, { customer, productCode }),
        subject: utils_1.interpolate(emails_1.Emails.emailVerification.subject, { customer, productCode }),
    });
};
exports.emailVerification = emailVerification;
//# sourceMappingURL=emailVerification.js.map