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
exports.createTaxes = void 0;
const archiver_1 = __importDefault(require("archiver"));
const rimraf = require('util').promisify(require('rimraf'));
const mkdirp = __importStar(require("mkdirp"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const moment_1 = __importDefault(require("moment"));
const quotation_1 = __importDefault(require("./quotation"));
const utils_1 = require("../../utils/utils");
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const countries_1 = __importDefault(require("./countries"));
const tmpPath = path.join(os.tmpdir(), 'jsreport', 'taxes');
async function renderSale(services, sale, templatePath) {
    await services.renderInvoice(sale, templatePath);
    const invoiceBuffer = await services.readInvoice(sale.id + '.pdf');
    fs.writeFileSync(path.join(tmpPath, 'data', sale.id + '.pdf'), invoiceBuffer);
}
async function calculateFees(stripeSales, gumroadInvoices) {
    let incomes = 0;
    for (const stripeSale of stripeSales) {
        incomes += stripeSale.accountingData.price;
    }
    for (const gumroadInvoice of gumroadInvoices) {
        incomes += gumroadInvoice.amount;
    }
    return utils_1.round(incomes * 0.23);
}
async function findStripeSales(services) {
    const customers = await services.customerRepository.findCustomersWithInvoicesLastMonth();
    const startOfMonth = moment_1.default().add(-1, 'M').startOf('month').toDate();
    const endOfMonth = moment_1.default().add(-1, 'M').endOf('month').toDate();
    const sales = [];
    for (const customer of customers) {
        for (const product of customer.products) {
            for (const sale of product.sales) {
                if (sale.purchaseDate > startOfMonth && sale.purchaseDate < endOfMonth) {
                    sales.push(sale);
                }
            }
        }
    }
    return sales;
}
async function downloadStripeInvoices(services, stripeSales) {
    for (const sale of stripeSales) {
        const invoiceBuffer = await services.readInvoice(sale.blobName);
        fs.writeFileSync(path.join(tmpPath, 'data', sale.blobName), invoiceBuffer);
    }
}
async function renderPohodaXml(services, sales) {
    var _a, _b, _c;
    const id = new Date().getFullYear() + '-' + new Date().getMonth() + 'POHODA';
    for (const s of sales) {
        const countryEnum = countries_1.default.find(c => c.name === s.accountingData.country);
        s.accountingData.countryCode = countryEnum ? countryEnum.code : s.accountingData.country;
        if (s.accountingData.currency === 'usd') {
            s.accountingData.currencyRate = await quotation_1.default(moment_1.default(s.purchaseDate).format('DD.MM.YYYY'), 'USD');
        }
        if (s.stripe) {
            const pi = await services.stripe.findPaymentIntent(s.stripe.paymentIntentId);
            if (((_a = pi.charges) === null || _a === void 0 ? void 0 : _a.data) && ((_c = (_b = pi.charges) === null || _b === void 0 ? void 0 : _b.data[0]) === null || _c === void 0 ? void 0 : _c.balance_transaction)) {
                const feeInCents = pi.charges.data[0].balance_transaction.fee;
                Object.assign(s.accountingData, { fee: utils_1.round(feeInCents / 100) });
            }
        }
    }
    await services.renderInvoice({
        id,
        items: sales
    }, '/payments/pohoda', 'xml');
    const invoicesXml = await services.readInvoice(`${id}.xml`);
    fs.writeFileSync(path.join(tmpPath, 'data', `${id}.xml`), iconv_lite_1.default.encode(invoicesXml.toString(), 'win1250'));
}
function convertGumroadInvoiceToSale(invoice) {
    return {
        purchaseDate: new Date(invoice.date),
        id: invoice.id,
        blobName: invoice.id + '.pdf',
        accountingData: {
            name: 'Gumroad Inc, , San Francisco, CA',
            address: '225 Valencia St, San Francisco, California USA',
            country: 'United States',
            isEU: false,
            vatRate: 0,
            currency: 'usd',
            price: invoice.amount,
            amount: invoice.amount,
            item: 'Fees for the sold jsreport licenses',
            vatAmount: 0,
            vatNumber: null,
        }
    };
}
function convertPeruInvoiceToSale(invoice) {
    return {
        purchaseDate: new Date(invoice.date),
        id: invoice.id,
        blobName: invoice.id + '.pdf',
        accountingData: {
            name: 'Boris Matos Morillo',
            address: 'Jr San Clara Mz A5 Lt 2 Urb, San Martin de Porres',
            country: 'Peru',
            isEU: false,
            vatRate: 0,
            currency: 'usd',
            price: invoice.amount,
            amount: invoice.amount,
            item: 'jsreport implementation',
            vatAmount: 0,
            vatNumber: null,
            isExpense: true
        }
    };
}
async function createFeeSale(price) {
    const vatAmount = utils_1.round(price * 0.21);
    const id = new Date().getFullYear() + '-' + new Date().getMonth() + 'F';
    return {
        purchaseDate: new Date(),
        id: id,
        blobName: id + '.pdf',
        accountingData: {
            name: 'Jan Blaha',
            address: 'U Sluncové 603/9, 186 00 Praha',
            country: 'Czech Republic',
            isEU: true,
            vatRate: 21,
            currencyRate: await quotation_1.default(moment_1.default(new Date()).format('DD.MM.YYYY'), 'USD'),
            currency: 'usd',
            price: price,
            amount: utils_1.round(price + vatAmount),
            vatAmount,
            item: 'Fees for the sold jsreport licenses',
            vatNumber: 'CZ8501274529',
            isExpense: true
        }
    };
}
const createTaxes = (services) => async (data) => {
    await rimraf(tmpPath);
    mkdirp.sync(path.join(tmpPath, 'data'));
    const peruSale = convertPeruInvoiceToSale(data.peru);
    const gumroadSales = data.gumroadInvoices.map(convertGumroadInvoiceToSale);
    await renderSale(services, peruSale, '/payments/invoice peru');
    for (const gs of gumroadSales) {
        await renderSale(services, gs, '/payments/invoice gumroad');
    }
    const stripeSales = await findStripeSales(services);
    const feesAmount = await calculateFees(stripeSales, data.gumroadInvoices);
    const feeSale = await createFeeSale(feesAmount);
    await renderSale(services, feeSale, '/payments/invoice fee');
    await downloadStripeInvoices(services, stripeSales);
    await renderPohodaXml(services, [peruSale, ...gumroadSales, ...stripeSales, feeSale]);
    const archive = archiver_1.default('zip');
    const output = fs.createWriteStream(path.join(tmpPath, 'taxes.zip'));
    archive.pipe(output);
    archive.directory(path.join(tmpPath, 'data'), false);
    await new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);
        archive.finalize();
    });
    return fs.createReadStream(path.join(tmpPath, 'taxes.zip'));
};
exports.createTaxes = createTaxes;
//# sourceMappingURL=taxes.js.map