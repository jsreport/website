"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerification = void 0;
const emailProcessor_1 = __importDefault(require("./emailProcessor"));
const emailVerification = (services) => async (email, product) => {
    const customer = await services.customerRepository.findOrCreate(email.toLocaleLowerCase());
    await emailProcessor_1.default(services.sendEmail, 'emailVerification', customer, {
        product
    });
};
exports.emailVerification = emailVerification;
//# sourceMappingURL=emailVerification.js.map