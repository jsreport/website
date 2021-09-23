"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger = __importStar(require("../utils/logger"));
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../utils/utils");
const emails_1 = require("./emails");
class SubscriptionRenewal {
    constructor(services, interval) {
        this.services = services;
        this.interval = interval || moment_1.default.duration(10, 'minute');
    }
    start() {
        if (process.env.SUBSCRIPTIN_RENEWAL_ENABLED) {
            logger.info(`Initializing subscriptions timer to ${this.interval.asMinutes()}min`);
            this.intervalRef = setInterval(() => this.process(), this.interval.asMilliseconds());
        }
        else {
            logger.info(`Subscription renewal interval disabled`);
        }
    }
    stop() {
        this.intervalRef.unref();
    }
    async process() {
        logger.info('Processing subscriptions renewal');
        try {
            const customers = await this.services.customerRepository.findCustomersWithPastDueSubscriptions();
            for (const customer of customers) {
                for (const product of customer.products) {
                    if (!product.isSubscription || product.subscription.state === 'canceled' || product.subscription.nextPayment > new Date()) {
                        continue;
                    }
                    if (product.subscription.retryPlannedPayment && product.subscription.retryPlannedPayment > new Date()) {
                        continue;
                    }
                    if (product.subscription.plannedCancelation && product.subscription.plannedCancelation > new Date()) {
                        continue;
                    }
                    await this.processSubscription(customer, product);
                }
            }
            logger.info('Processing subscriptions renewal ended');
        }
        catch (e) {
            logger.error('Critical error when processing subscriptions renew', e);
        }
    }
    async processSubscription(customer, product) {
        logger.info(`Processing subscription renewal of ${product.name} for ${customer.email} started`);
        if (product.subscription.plannedCancelation) {
            return this._processCancellation(customer, product);
        }
        const lastSale = product.sales[product.sales.length - 1];
        let paymentIntent;
        try {
            logger.info(`Initiating charge for ${product.name} for ${customer.email} of ${lastSale.accountingData.amount} USD`);
            const stripeCustomer = await this.services.stripe.findOrCreateCustomer(customer.email);
            paymentIntent = await this.services.stripe.createConfirmedPaymentIntent(stripeCustomer.id, product.subscription.stripe.paymentMethodId, lastSale.accountingData.amount);
        }
        catch (e) {
            if (product.subscription.retryPlannedPayment) {
                return this._processSecondFailedPayment(customer, product, e);
            }
            else {
                logger.warn(`Processing subscription renewal of ${product.name} for ${customer.email} errored but will retry`, e);
                product.subscription.retryPlannedPayment = moment_1.default().add(1, 'days').toDate();
                await this.services.customerRepository.update(customer);
            }
            return;
        }
        return this.processSucesfullPayment(customer, product, paymentIntent);
    }
    async _processSecondFailedPayment(customer, product, e) {
        logger.warn(`Processing subscription renewal of ${product.name} for ${customer.email} errored and waiting for user`, e);
        product.subscription.retryPlannedPayment = null;
        product.subscription.plannedCancelation = moment_1.default(product.subscription.nextPayment).add(1, 'months').toDate();
        await this.services.customerRepository.update(customer);
        await this.services.sendEmail({
            to: customer.email,
            content: utils_1.interpolate(emails_1.Emails.recurringFail.customer.content, { customer, product }),
            subject: utils_1.interpolate(emails_1.Emails.recurringFail.customer.subject, { customer, product }),
        });
        await this.services.sendEmail({
            to: 'jan.blaha@jsreport.net',
            content: utils_1.interpolate(emails_1.Emails.recurringFail.us.content, { customer, product }),
            subject: utils_1.interpolate(emails_1.Emails.recurringFail.us.subject, { customer, product }),
        });
    }
    async _processCancellation(customer, product) {
        logger.warn(`Processing subscription renewal of ${product.name} for ${customer.email} reached cancelation date`);
        product.subscription.retryPlannedPayment = null;
        product.subscription.plannedCancelation = null;
        product.subscription.state = 'canceled';
        return this.services.customerRepository.update(customer);
    }
    async processSucesfullPayment(customer, product, paymentIntent) {
        const lastSale = product.sales[product.sales.length - 1];
        const sale = await this.services.customerRepository.createSale(lastSale.accountingData, {
            paymentIntentId: paymentIntent.id,
        });
        await this.services.renderInvoice(sale);
        product.sales.push(sale);
        product.subscription.plannedCancelation = null;
        product.subscription.nextPayment = moment_1.default(product.subscription.nextPayment).add(1, 'years').toDate();
        product.subscription.state = 'active';
        product.subscription.retryPlannedPayment = null;
        await this.services.customerRepository.update(customer);
        await this.services.notifyLicensingServer(customer, product, sale);
        await this.services.sendEmail({
            to: customer.email,
            content: utils_1.interpolate(emails_1.Emails.recurring.customer.content, { customer, product }),
            subject: utils_1.interpolate(emails_1.Emails.recurring.customer.subject, { customer, product }),
        });
        await this.services.sendEmail({
            to: 'jan.blaha@jsreport.net',
            content: utils_1.interpolate(emails_1.Emails.recurring.us.content, { customer, product }),
            subject: utils_1.interpolate(emails_1.Emails.recurring.us.subject, { customer, product }),
        });
        logger.info(`Processing subscription renewal of ${product.name} for ${customer.email} completed`);
    }
}
exports.default = SubscriptionRenewal;
//# sourceMappingURL=subscriptionRenewal.js.map