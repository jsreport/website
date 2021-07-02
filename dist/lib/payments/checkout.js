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
exports.checkout = void 0;
const logger = __importStar(require("../utils/logger"));
const v4_1 = __importDefault(require("uuid/v4"));
const nanoid_1 = __importDefault(require("nanoid"));
const emails_1 = require("./emails");
const utils_1 = require("../utils/utils");
const moment_1 = __importDefault(require("moment"));
const uuid = () => v4_1.default().toUpperCase();
const checkout = (services) => async (checkoutData) => {
    logger.info('Processing checkout ' + JSON.stringify(checkoutData));
    const customer = await services.customerRepository.find(checkoutData.customerId);
    const stripePaymentIntent = await services.stripe.findPaymentIntent(checkoutData.paymentIntentId);
    const stripePaymentMethod = stripePaymentIntent.payment_method;
    let subscription;
    if (checkoutData.product.isSubscription) {
        subscription = {
            state: 'active',
            nextPayment: moment_1.default().add(1, 'years').toDate(),
            card: {
                last4: stripePaymentMethod.card.last4,
                expMonth: stripePaymentMethod.card.exp_month,
                expYear: stripePaymentMethod.card.exp_year,
            },
            stripe: {
                paymentMethodId: stripePaymentIntent.payment_method.id,
            },
        };
    }
    const accountingData = {
        address: checkoutData.address,
        amount: checkoutData.amount,
        country: checkoutData.country,
        currency: checkoutData.currency,
        isEU: checkoutData.isEU,
        name: checkoutData.name,
        price: checkoutData.price,
        vatAmount: checkoutData.vatAmount,
        vatNumber: checkoutData.vatNumber,
        vatRate: checkoutData.vatRate,
        item: checkoutData.product.name,
        email: customer.email
    };
    const product = {
        code: checkoutData.product.code,
        permalink: checkoutData.product.permalink,
        isSubscription: checkoutData.product.isSubscription,
        name: checkoutData.product.name,
        isSupport: checkoutData.product.isSupport,
        id: nanoid_1.default(4),
        sales: [],
        accountingData,
        licenseKey: (checkoutData.product.isSupport || checkoutData.product.hasLicenseKey === false) ? null : uuid(),
        subscription,
    };
    const sale = await services.customerRepository.createSale(accountingData, {
        paymentIntentId: stripePaymentIntent.id,
    });
    await services.renderInvoice(sale);
    product.sales.push(sale);
    await services.notifyLicensingServer(customer, product, product.sales[0]);
    customer.products = customer.products || [];
    customer.products.push(product);
    await services.customerRepository.update(customer);
    let mail = emails_1.Emails.checkout.custom;
    if (product.isSupport) {
        mail = emails_1.Emails.checkout.support;
    }
    if (product.licenseKey) {
        mail = emails_1.Emails.checkout.enterprise;
    }
    await services.sendEmail({
        to: customer.email,
        content: utils_1.interpolate(mail.customer.content, {
            customer,
            product,
            sale: product.sales[0],
        }),
        subject: utils_1.interpolate(mail.customer.subject, {
            customer,
            product,
            sale: product.sales[0],
        }),
    });
    await services.sendEmail({
        to: 'jan.blaha@jsreport.net',
        content: utils_1.interpolate(mail.us.content, { customer, product }),
        subject: utils_1.interpolate(mail.us.subject, { customer, product }),
    });
    return customer;
};
exports.checkout = checkout;
//# sourceMappingURL=checkout.js.map