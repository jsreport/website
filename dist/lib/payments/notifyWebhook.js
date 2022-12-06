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
exports.notifyWebhook = void 0;
const axios_1 = __importDefault(require("axios"));
const logger = __importStar(require("../utils/logger"));
const notifyWebhook = async function (customer, product, event) {
    logger.info(`Processing webhook ${product.webhook} with customer.uuid: ${customer.uuid}, product.id: ${product.id}, product.planCode: ${product.planCode}`);
    const r = await axios_1.default.post(product.webhook, {
        verification: process.env.webhookVerification,
        event,
        customer: {
            email: customer.email,
            uuid: customer.uuid,
            product: {
                id: product.id,
                planCode: product.planCode,
                subscription: product.subscription
            }
        }
    });
    logger.info(`Webhook response ${r.status}, ${r.data}`);
};
exports.notifyWebhook = notifyWebhook;
//# sourceMappingURL=notifyWebhook.js.map