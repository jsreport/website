"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const currencyCache = {};
async function quotation(date, currency) {
    if (currencyCache[date + currency]) {
        return currencyCache[date + currency];
    }
    const response = await axios.get(`http://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt?date=${date}`);
    const stringResponse = response.data;
    if (stringResponse.indexOf('USD') === -1) {
        return 0;
    }
    const fragments = stringResponse.split('|');
    let i = 0;
    while (fragments[i++] !== currency) { }
    currencyCache[date + currency] = parseFloat(fragments[i].split('\n')[0].replace(',', '.'));
    return currencyCache[date + currency];
}
exports.default = quotation;
//# sourceMappingURL=quotation.js.map