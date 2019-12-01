"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findOrCreateCustomer_1 = require("./findOrCreateCustomer");
exports.CheckoutAction = async (context, checkoutRequest) => {
    const cutomer = await context.dispatcher.dispatch(findOrCreateCustomer_1.findOrCreateCustomer, context, checkoutRequest.email);
};
//# sourceMappingURL=checkout.js.map