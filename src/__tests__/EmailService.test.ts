import { EmailService } from '../EmailService';
import sgMail from '@sendgrid/mail';

// Mock SendGrid
jest.mock('@sendgrid/mail');

describe('EmailService', () => {
    let emailService: EmailService;
    const mockConfig = {
        apiKey: 'test-api-key',
        fromEmail: 'test@example.com'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        emailService = new EmailService(mockConfig);
    });

    describe('sendEmail', () => {
        const mockEmailData = {
            to: 'recipient@example.com',
            subject: 'Test Subject',
            text: 'Test Content',
            html: '<p>Test Content</p>',
            metadata: { key: 'value' }
        };

        it('should send email successfully', async () => {
            (sgMail.send as jest.Mock).mockResolvedValue([{ statusCode: 202 }]);

            await expect(emailService.sendEmail(mockEmailData)).resolves.not.toThrow();

            expect(sgMail.send).toHaveBeenCalledWith({
                to: mockEmailData.to,
                from: mockConfig.fromEmail,
                subject: mockEmailData.subject,
                text: mockEmailData.text,
                html: mockEmailData.html,
                customArgs: mockEmailData.metadata
            });
        });

        it('should handle SendGrid errors', async () => {
            const error = new Error('SendGrid error');
            (sgMail.send as jest.Mock).mockRejectedValue(error);

            await expect(emailService.sendEmail(mockEmailData)).rejects.toThrow('Failed to send email: SendGrid error');
        });

        it('should handle missing metadata', async () => {
            const emailDataWithoutMetadata = { ...mockEmailData };
            delete emailDataWithoutMetadata.metadata;

            (sgMail.send as jest.Mock).mockResolvedValue([{ statusCode: 202 }]);

            await expect(emailService.sendEmail(emailDataWithoutMetadata)).resolves.not.toThrow();

            expect(sgMail.send).toHaveBeenCalledWith({
                to: mockEmailData.to,
                from: mockConfig.fromEmail,
                subject: mockEmailData.subject,
                text: mockEmailData.text,
                html: mockEmailData.html,
                customArgs: {}
            });
        });

        it('should handle non-Error objects', async () => {
            (sgMail.send as jest.Mock).mockRejectedValue('String error');

            await expect(emailService.sendEmail(mockEmailData)).rejects.toThrow('Failed to send email: String error');
        });
    });
}); 