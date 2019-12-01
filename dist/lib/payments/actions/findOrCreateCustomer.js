"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = __importDefault(require("nanoid"));
exports.findOrCreateCustomer = async (context, email) => {
    let customer = await context.services.db.collection('customers').findOne({ email });
    if (customer) {
        return customer;
    }
    customer = {
        email,
        uuid: nanoid_1.default(16),
        creationDate: new Date()
    };
    await this.db.collection('customers').insertOne(customer);
    return customer;
};
//# sourceMappingURL=findOrCreateCustomer.js.map