"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCustomerLink = void 0;
const emailProcessor_1 = __importDefault(require("./emailProcessor"));
const sendCustomerLink = (services) => async (email) => {
    let customer;
    try {
        customer = await services.customerRepository.findByEmail(email);
    }
    catch (e) {
        return;
    }
    await emailProcessor_1.default(services.sendEmail, 'customerLink', customer, {});
};
exports.sendCustomerLink = sendCustomerLink;
//# sourceMappingURL=sendCustomerLink.js.map