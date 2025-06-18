import { EmailServiceConfig } from './notification_types';
export declare class EmailService {
    private config;
    constructor(serviceConfig?: EmailServiceConfig);
    sendEmail({ to, subject, text, html, metadata }: {
        to: string;
        subject: string;
        text: string;
        html: string;
        metadata?: Record<string, any>;
    }): Promise<void>;
}
