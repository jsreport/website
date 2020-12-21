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
exports.renderInvoice = async (data, templatePath = '/payments/invoice', fileExtension = 'pdf') => {
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
exports.readInvoice = async (blobName) => {
    return fs.readFileSync(path.join(process.cwd(), 'data', 'invoices', blobName));
};
//# sourceMappingURL=renderInvoice.js.map