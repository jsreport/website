"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mjml_1 = __importDefault(require("mjml"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils/utils");
const moment_1 = __importDefault(require("moment"));
const config = {
    'checkout-license': {
        subject: 'You bought ${product.name}',
        sendUs: true
    },
    'checkout': {
        subject: 'You bought ${product.name}',
        sendUs: true
    },
    'recurring': {
        subject: '${product.name} renewal successful',
        sendUs: true
    },
    'recurringFail': {
        subject: '${product.name} renewal failed',
        sendUs: true
    },
    'customerLink': {
        subject: 'jsreport customer dashboard link'
    },
    'emailVerification': {
        subject: 'jsreport email verification'
    },
    'cancel': {
        subject: '${product.name} canceled',
        sendUs: true
    }
};
async function default_1(sendEmail, type, customer, data) {
    const emailFolder = path_1.default.join(process.cwd(), 'src/lib/payments/emails');
    const content = await fs_1.promises.readFile(path_1.default.join(emailFolder, `${type}.mjml`));
    data = { ...data, customer, moment: moment_1.default };
    await sendEmail({
        subject: utils_1.interpolate(config[type].subject, data),
        to: [customer.email, customer.notificationEmail].filter(e => e).join(','),
        content: utils_1.interpolate(mjml_1.default(content.toString(), {
            filePath: emailFolder
        }).html, data)
    });
    if (config[type].sendUs) {
        await sendEmail({
            subject: utils_1.interpolate(config[type].subject, data),
            to: 'jan.blaha@jsreport.net',
            content: `${customer.email}<br><a href='https://jsreport.net/payments/customer/${customer.uuid}'>https://jsreport.net/payments/customer/${customer.uuid}</a><br>`
                + utils_1.interpolate(mjml_1.default(content.toString(), {
                    filePath: emailFolder
                }).html, data)
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=emailProcessor.js.map