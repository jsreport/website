"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
class StripeFacade {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2020-03-02',
        });
    }
    async createPaymentIntent({ amount, email }) {
        if (amount > 4000) {
            throw new Error('Something went wrong');
        }
        let customer = await this.findOrCreateCustomer(email);
        const r = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            customer: customer.id,
            setup_future_usage: 'off_session',
        });
        return r.client_secret;
    }
    async createSetupIntent({ email }) {
        let customer = await this.findOrCreateCustomer(email);
        const r = await this.stripe.setupIntents.create({
            customer: customer.id,
            usage: 'on_session',
        });
        return r.client_secret;
    }
    async findOrCreateCustomer(email) {
        const existingCustomers = await this.stripe.customers.list({
            email: email.toLowerCase(),
        });
        if (existingCustomers.data.length === 0) {
            return this.stripe.customers.create({ email: email.toLowerCase() });
        }
        return existingCustomers.data[0];
    }
    async createConfirmedPaymentIntent(customerId, paymentMethodId, amount) {
        if (amount > 2500) {
            throw new Error('Something went wrong');
        }
        return this.stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            customer: customerId,
            payment_method: paymentMethodId,
            off_session: true,
            confirm: true,
        });
    }
    async findPaymentMethod(paymentMethodId) {
        return this.stripe.paymentMethods.retrieve(paymentMethodId);
    }
    async findSetupIntent(setupIntentId) {
        return this.stripe.setupIntents.retrieve(setupIntentId, {
            expand: ['payment_method.card'],
        });
    }
    parseWebHook(signature, data) {
        return this.stripe.webhooks.constructEvent(data, signature, process.env.STRIPE_WEBHOOK_SECRET);
    }
    async findPaymentIntent(paymentIntentId) {
        return this.stripe.paymentIntents.retrieve(paymentIntentId, {
            expand: ['payment_method.card', 'charges.data.balance_transaction'],
        });
    }
}
exports.default = StripeFacade;
//# sourceMappingURL=stripe.js.map