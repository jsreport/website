"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCustomerLink = void 0;
const emails_1 = require("./emails");
const utils_1 = require("../utils/utils");
const sendCustomerLink = (services) => async (email) => {
    let customer;
    try {
        customer = await services.customerRepository.findByEmail(email);
    }
    catch (e) {
        return;
    }
    services.sendEmail({
        to: customer.email,
        subject: emails_1.Emails.customerLink.subject,
        content: utils_1.interpolate(emails_1.Emails.customerLink.content, { customer })
    });
};
exports.sendCustomerLink = sendCustomerLink;
//# sourceMappingURL=sendCustomerLink.js.map