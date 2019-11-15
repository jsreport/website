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
const azure = __importStar(require("azure-storage"));
const jsreport_client_1 = __importDefault(require("jsreport-client"));
const bluebird_1 = __importDefault(require("bluebird"));
const stream_1 = __importDefault(require("stream"));
const jsreportClient = jsreport_client_1.default(process.env.JO_URL, process.env.JO_USER, process.env.JO_PASSWORD);
const blobServiceAsync = bluebird_1.default.promisifyAll(azure.createBlobService());
exports.renderInvoice = async (data) => {
    logger.info('request invoice generation in jo');
    const renderResult = await jsreportClient.render({
        template: {
            name: '/payments/invoice'
        },
        data
    });
    const buffer = await renderResult.body();
    return blobServiceAsync.createBlockBlobFromTextAsync('invoices', data.id + '.pdf', buffer);
};
exports.readInvoice = async (blobName) => {
    const data = [];
    const writingStream = new stream_1.default.Writable({
        write: (chunk, encoding, next) => {
            data.push(chunk);
            next();
        }
    });
    await blobServiceAsync.getBlobToStreamAsync('invoices', blobName, writingStream);
    return Buffer.concat(data);
};
//# sourceMappingURL=renderInvoice.js.map