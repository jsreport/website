"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const braintree = __importStar(require("braintree"));
class Braintree {
    constructor() {
        this._gateway = new braintree.BraintreeGateway({
            environment: process.env.BRAINTREE_PRODUCTION ? braintree.Environment.Production : braintree.Environment.Sandbox,
            merchantId: process.env.BRAINTREE_MERCHANT_ID,
            publicKey: process.env.BRAINTREE_PUBLIC_KEY,
            privateKey: process.env.BRAINTREE_PRIVATE_KEY,
        });
    }
    generateToken() {
        return this._gateway.clientToken.generate({}).then(r => r.clientToken);
    }
    createCustomer(obj) {
        return this._gateway.customer.create(obj);
    }
    createPaymentMethod(obj) {
        return this._gateway.paymentMethod.create(obj);
    }
    createSubscription(obj) {
        return this._gateway.subscription.create({
            ...obj,
            merchantAccountId: process.env.BRAINTREE_MERCHANT_ACCOUNT_ID
        });
    }
    createSale(obj) {
        return this._gateway.transaction.sale({
            ...obj,
            merchantAccountId: process.env.BRAINTREE_MERCHANT_ACCOUNT_ID
        });
    }
    updateSubscription(id, obj) {
        return this._gateway.subscription.update(id, {
            ...obj,
            merchantAccountId: process.env.BRAINTREE_MERCHANT_ACCOUNT_ID
        });
    }
    cancelSubscription(obj) {
        return this._gateway.subscription.cancel(obj);
    }
    parseWebHook(signature, obj) {
        return this._gateway.webhookNotification.parse(signature, obj);
    }
}
exports.default = Braintree;
//# sourceMappingURL=braintree.js.map