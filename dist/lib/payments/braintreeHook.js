"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger = __importStar(require("../utils/logger"));
const utils_1 = require("../utils/utils");
const emails_1 = require("./emails");
function braintreeHook(services) {
    async function processSubscriptionChargeNotif(subscription) {
        if (subscription.currentBillingCycle === 1) {
            logger.info(`Skip braintree hook for subscription ${subscription.id} because it is the first payment`);
            return;
        }
        logger.info('Search for customer with subscription id ' + subscription.id);
        const customer = await services.customerRepository.findBySubscription(subscription.id);
        if (!customer) {
            throw Error('Unable to find customer with subscription');
        }
        logger.info('Processing subscription successful charge notification for customer ' + customer.email);
        const product = customer.products.find(p => p.braintree.subscription && p.braintree.subscription.id === subscription.id);
        product.braintree.subscription = subscription;
        const sale = await services.customerRepository.createSale(product.accountingData, subscription.transactions[subscription.transactions.length - 1]);
        await services.renderInvoice(sale);
        product.sales.push(sale);
        await services.customerRepository.update(customer);
        await services.notifyLicensingServer(customer, product, sale);
        await services.sendEmail({
            to: customer.email,
            content: utils_1.interpolate(emails_1.Emails.recurring.customer.content, { customer, product, sale }),
            subject: utils_1.interpolate(emails_1.Emails.recurring.customer.subject, { customer, product, sale }),
        });
        await services.sendEmail({
            to: 'jan.blaha@jsreport.net',
            content: utils_1.interpolate(emails_1.Emails.recurring.us.content, { customer, product, sale }),
            subject: utils_1.interpolate(emails_1.Emails.recurring.us.subject, { customer, product, sale }),
        });
    }
    async function processSubscriptionFailedChargeNotif(subscription) {
        logger.info('Search for customer with subscription id ' + subscription.id);
        const customer = await services.customerRepository.findBySubscription(subscription.id);
        if (!customer) {
            throw Error('Unable to find customer with subscription');
        }
        logger.info('Processing subscription failed charge notification for customer ' + customer.email);
        const product = customer.products.find(p => p.braintree.subscription && p.braintree.subscription.id === subscription.id);
        product.braintree.subscription = subscription;
        await services.customerRepository.update(customer);
        await services.sendEmail({
            to: customer.email,
            content: utils_1.interpolate(emails_1.Emails.recurringFail.customer.content, { customer, product }),
            subject: utils_1.interpolate(emails_1.Emails.recurringFail.customer.subject, { customer, product }),
        });
        await services.sendEmail({
            to: 'jan.blaha@jsreport.net',
            content: utils_1.interpolate(emails_1.Emails.recurringFail.us.content, { customer, product }),
            subject: utils_1.interpolate(emails_1.Emails.recurringFail.us.subject, { customer, product }),
        });
    }
    async function processSubscriptionCanceledNotif(subscription) {
        logger.info('Search for customer with subscription id ' + subscription.id);
        const customer = await services.customerRepository.findBySubscription(subscription.id);
        if (!customer) {
            throw Error('Unable to find customer with subscription');
        }
        logger.info('Processing subscription canceled notification for customer ' + customer.email);
        const product = customer.products.find(p => p.braintree.subscription && p.braintree.subscription.id === subscription.id);
        if (product.braintree.subscription.status !== 'Active') {
            logger.info('Subscription already canceled, skipping');
            return;
        }
        product.braintree.subscription = subscription;
        await services.customerRepository.update(customer);
        await services.sendEmail({
            to: customer.email,
            content: utils_1.interpolate(emails_1.Emails.recurringCancel.customer.content, { customer, product }),
            subject: utils_1.interpolate(emails_1.Emails.recurringCancel.customer.subject, { customer, product }),
        });
        await services.sendEmail({
            to: 'jan.blaha@jsreport.net',
            content: utils_1.interpolate(emails_1.Emails.recurringCancel.us.content, { customer, product }),
            subject: utils_1.interpolate(emails_1.Emails.recurringCancel.us.subject, { customer, product }),
        });
    }
    return async function (signature, body) {
        const webhookNotification = await services.braintree.parseWebHook(signature, body);
        logger.info('processing braintree hook ' + JSON.stringify(webhookNotification));
        try {
            switch (webhookNotification.kind) {
                case 'subscription_charged_successfully':
                    return processSubscriptionChargeNotif(webhookNotification.subscription);
                case 'subscription_charged_unsuccessfully':
                    return processSubscriptionFailedChargeNotif(webhookNotification.subscription);
                case 'subscription_canceled':
                    return processSubscriptionCanceledNotif(webhookNotification.subscription);
                default:
                    logger.info('skip processing ' + webhookNotification.kind);
            }
        }
        catch (e) {
            logger.error('Critical error when processing braintree hook', e);
            throw e;
        }
    };
}
exports.braintreeHook = braintreeHook;
//# sourceMappingURL=braintreeHook.js.map