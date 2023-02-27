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
exports.sendEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const logger = __importStar(require("./logger.js"));
const sendEmail = async (Mail) => {
    mail_1.default.setApiKey(process.env.SENDGRID);
    logger.info(`Sending email (${Mail.subject}) to ${Mail.to}`);
    const msg = {
        from: 'sales@jsreport.net',
        to: Mail.to.split(','),
        subject: Mail.subject,
        html: Mail.content
    };
    try {
        await mail_1.default.send(msg);
        logger.info('sent succesfully');
    }
    catch (e) {
        logger.error('Error while sending mail:', e);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=mailer.js.map