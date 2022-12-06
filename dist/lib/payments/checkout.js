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
const products_1 = __importDefault(require("../../shared/products"));
const uuid = () => v4_1.default().toUpperCase();
const checkout = (services) => async (checkoutData) => {
    logger.info('Processing checkout ' + JSON.stringify(checkoutData));
    const customer = await services.customerRepository.find(checkoutData.customerId);
    const stripePaymentIntent = await services.stripe.findPaymentIntent(checkoutData.paymentIntentId);
    const stripePaymentMethod = stripePaymentIntent.payment_method;
    const productFromCheckout = products_1.default[checkoutData.productCode];
    let subscription;
    if (productFromCheckout.isSubscription) {
        subscription = {
            state: 'active',
            nextPayment: checkoutData.paymentCycle === 'monthly' ? moment_1.default().add(1, 'months').toDate() : moment_1.default().add(1, 'years').toDate(),
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
        item: productFromCheckout.name,
        email: customer.email
    };
    let product = {
        code: productFromCheckout.code,
        permalink: productFromCheckout.permalink,
        isSubscription: productFromCheckout.isSubscription,
        name: productFromCheckout.name,
        isSupport: productFromCheckout.isSupport,
        id: nanoid_1.default(4),
        sales: [],
        accountingData,
        licenseKey: (productFromCheckout.hasLicenseKey === false) ? null : uuid(),
        subscription,
        paymentCycle: checkoutData.paymentCycle,
        webhook: productFromCheckout.webhook,
        planCode: checkoutData.planCode
    };
    const sale = await services.customerRepository.createSale(accountingData, {
        paymentIntentId: stripePaymentIntent.id,
    });
    await services.renderInvoice(sale);
    product.sales.push(sale);
    await services.notifyLicensingServer(customer, product, product.sales[0]);
    customer.products = customer.products || [];
    if (product.planCode) {
        const existingProduct = customer.products.find(p => p.code == product.code);
        if (existingProduct) {
            existingProduct.planCode = product.planCode;
            existingProduct.sales.push(sale);
            existingProduct.accountingData = accountingData;
            existingProduct.subscription = product.subscription;
            product = existingProduct;
        }
        else {
            customer.products.push(product);
        }
    }
    else {
        customer.products.push(product);
    }
    await services.customerRepository.update(customer);
    const mail = emails_1.Emails.checkout[productFromCheckout.emailType];
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
    if (productFromCheckout.webhook) {
        await services.notifyWebhook(customer, product, 'checkouted');
    }
    return product;
};
exports.checkout = checkout;
//# sourceMappingURL=checkout.js.map