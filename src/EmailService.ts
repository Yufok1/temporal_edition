// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

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