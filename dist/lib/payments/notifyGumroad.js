"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(axios) {
    return function (paymentInfo) {
        return axios.post('https://jsreportonline.net/gumroad-hook', {
            email: paymentInfo.email,
            purchaseDate: paymentInfo.purchaseDate,
            customer: paymentInfo.customer,
            price: paymentInfo.amount,
            currency: paymentInfo.currency,
            invoiceId: paymentInfo.invoiceId,
            license_key: paymentInfo.license_key,
            braintree: true,
            product_name: paymentInfo.product.name,
            permalink: paymentInfo.product.permalink
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=notifyGumroad.js.map