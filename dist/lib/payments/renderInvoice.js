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
exports.readInvoice = exports.renderInvoice = void 0;
const logger = __importStar(require("../utils/logger"));
const jsreport_client_1 = __importDefault(require("jsreport-client"));
const fs = __importStar(require("fs"));
const bluebird_1 = __importDefault(require("bluebird"));
const path = __importStar(require("path"));
bluebird_1.default.promisifyAll(fs);
const jsreportClient = jsreport_client_1.default(process.env.JO_URL, process.env.JO_USER, process.env.JO_PASSWORD);
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
}
if (!fs.existsSync(path.join(process.cwd(), 'data', 'invoices'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data', 'invoices'));
}
const renderInvoice = async (data, templatePath = '/payments/invoice', fileExtension = 'pdf') => {
    logger.info('request invoice generation in jo');
    const renderResult = await jsreportClient.render({
        template: {
            name: templatePath
        },
        data
    });
    const buffer = await renderResult.body();
    return fs.writeFileSync(path.join(process.cwd(), 'data', 'invoices', data.id + '.' + fileExtension), buffer);
};
exports.renderInvoice = renderInvoice;
const readInvoice = async (blobName) => {
    return fs.readFileSync(path.join(process.cwd(), 'data', 'invoices', blobName));
};
exports.readInvoice = readInvoice;
//# sourceMappingURL=renderInvoice.js.map