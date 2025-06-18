"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
class EmailService {
    constructor(serviceConfig) {
        this.config = serviceConfig || {
            apiKey: config_1.config.sendgrid.apiKey,
            fromEmail: config_1.config.sendgrid.fromEmail
        };
        mail_1.default.setApiKey(this.config.apiKey);
        logger_1.default.info('EmailService initialized with SendGrid');
    }
    async sendEmail({ to, subject, text, html, metadata }) {
        try {
            const msg = {
                to,
                from: this.config.fromEmail,
                subject,
                text,
                html,
                customArgs: metadata || {}
            };
            await mail_1.default.send(msg);
            logger_1.default.info('Email sent successfully', { to, subject });
        }
        catch (error) {
            logger_1.default.error('Failed to send email', { error, to, subject });
            if (error instanceof Error) {
                throw new Error(`Failed to send email: ${error.message}`);
            }
            throw error;
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map