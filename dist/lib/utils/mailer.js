"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendgrid_1 = __importDefault(require("sendgrid"));
const logger = __importStar(require("./logger.js"));
const helper = sendgrid_1.default.mail;
exports.sendEmail = (Mail) => {
    const sg = sendgrid_1.default(process.env.SENDGRID);
    logger.info(`Sending email (${Mail.subject}) to ${Mail.to}`);
    const fromEmail = new helper.Email('sales@jsreport.net');
    const toEmail = new helper.Email(Mail.to);
    const contentEmail = new helper.Content('text/html', Mail.content);
    const mail = new helper.Mail(fromEmail, Mail.subject, toEmail, contentEmail);
    const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });
    return sg.API(request, (err, response) => {
        if (err) {
            logger.error('Error while sending mail:', err);
        }
        else {
            logger.info('sent succesfully');
        }
    });
};
//# sourceMappingURL=mailer.js.map