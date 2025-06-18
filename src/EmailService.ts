import sgMail from '@sendgrid/mail';
import { config } from './config';
import logger from './logger';
import { EmailServiceConfig } from './notification_types';

export class EmailService {
    private config: EmailServiceConfig;

    constructor(serviceConfig?: EmailServiceConfig) {
        this.config = serviceConfig || {
            apiKey: config.sendgrid.apiKey,
            fromEmail: config.sendgrid.fromEmail
        };
        sgMail.setApiKey(this.config.apiKey);
        logger.info('EmailService initialized with SendGrid');
    }

    async sendEmail({
        to,
        subject,
        text,
        html,
        metadata
    }: {
        to: string;
        subject: string;
        text: string;
        html: string;
        metadata?: Record<string, any>;
    }): Promise<void> {
        try {
            const msg = {
                to,
                from: this.config.fromEmail,
                subject,
                text,
                html,
                customArgs: metadata || {}
            };

            await sgMail.send(msg);
            logger.info('Email sent successfully', { to, subject });
        } catch (error) {
            logger.error('Failed to send email', { error, to, subject });
            if (error instanceof Error) {
                throw new Error(`Failed to send email: ${error.message}`);
            }
            throw error;
        }
    }
} 