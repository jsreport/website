"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger = __importStar(require("../utils/logger"));
const v4_1 = __importDefault(require("uuid/v4"));
const nanoid_1 = __importDefault(require("nanoid"));
const emails_1 = require("./emails");
const utils_1 = require("../utils/utils");
const uuid = () => v4_1.default().toUpperCase();
// the mock less solution is likely to fire just some events from the checkout script
// like { action: 'sendEmail', data: { subject: '...' }}
exports.checkout = (services) => async (checkoutData) => {
    logger.info('Processing checkout ' + JSON.stringify(checkoutData));
    const customer = await services.customerRepository.findOrCreate(checkoutData.email);
    let productBraintree = {};
    let braintreeTransaction = {};
    if (checkoutData.product.isSubscription) {
        if (customer.braintree == null) {
            const customerRes = await services.braintree.createCustomer({
                company: checkoutData.name,
                email: checkoutData.email
            });
            if (customerRes.success === false) {
                throw new Error('Unable to create customer: ' + customerRes.message);
            }
            customer.braintree = { customerId: customerRes.customer.id };
        }
        const pmr = await services.braintree.createPaymentMethod({
            customerId: customer.braintree.customerId,
            paymentMethodNonce: checkoutData.nonce,
            options: {
                verifyCard: true
            }
        });
        if (pmr.success === false) {
            throw new Error('Unable to register payment method: ' + pmr.message);
        }
        const sr = await services.braintree.createSubscription({
            paymentMethodToken: pmr.paymentMethod.token,
            planId: checkoutData.product.code + (checkoutData.vatRate !== 0 ? 'VAT' : ''),
            merchantAccountId: 'jsreportusd'
        });
        if (sr.success === false) {
            throw new Error('Unable to create subscription ' + sr.message);
        }
        braintreeTransaction = sr.transaction;
        productBraintree.paymentMethod = pmr.paymentMethod;
        productBraintree.subscription = sr.subscription;
    }
    else {
        const sr = await services.braintree.createSale({
            amount: checkoutData.amount,
            paymentMethodNonce: checkoutData.nonce,
            options: {
                submitForSettlement: true
            }
        });
        if (sr.success === false) {
            throw new Error('Unable to create sale ' + sr.message);
        }
        braintreeTransaction = sr.transaction;
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
        item: checkoutData.product.name
    };
    const product = {
        code: checkoutData.product.code,
        permalink: checkoutData.product.permalink,
        isSubscription: checkoutData.product.isSubscription,
        name: checkoutData.product.name,
        isSupport: checkoutData.product.isSupport,
        id: nanoid_1.default(4),
        sales: [],
        braintree: productBraintree,
        accountingData,
        licenseKey: checkoutData.product.isSupport ? null : uuid()
    };
    const sale = await services.customerRepository.createSale(accountingData, braintreeTransaction);
    await services.renderInvoice(sale);
    product.sales.push(sale);
    await services.notifyLicensingServer(customer, product, product.sales[0]);
    customer.products = customer.products || [];
    customer.products.push(product);
    await services.customerRepository.update(customer);
    const mail = product.isSupport
        ? emails_1.Emails.checkout.support
        : emails_1.Emails.checkout.enterprise;
    await services.sendEmail({
        to: customer.email,
        content: utils_1.interpolate(mail.customer.content, {
            customer,
            product,
            sale: product.sales[0]
        }),
        subject: utils_1.interpolate(mail.customer.subject, {
            customer,
            product,
            sale: product.sales[0]
        })
    });
    await services.sendEmail({
        to: 'jan.blaha@jsreport.net',
        content: utils_1.interpolate(mail.us.content, { customer, product }),
        subject: utils_1.interpolate(mail.us.subject, { customer, product })
    });
    return customer;
};
//# sourceMappingURL=checkout.js.map