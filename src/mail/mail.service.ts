import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';

import { ConfigService } from '../config/config.service';
import { EmailQueueName } from './constants';
import { IEMailProvider } from './interfaces/email.provider.interface';
import { EmailPayload, MailTemplates } from './templates';
import { CompanyCreatedEmailProps } from './templates/company-created-email';
import { ResetPasswordEmailProps } from './templates/reset-password-email';
import { SignupEmailVerificationProps } from './templates/verify-email';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        @InjectQueue(EmailQueueName) private mailQueue: Queue,
        private readonly appConfig: ConfigService,
        private mailProvider: IEMailProvider,
    ) {}

    async sendResetPasswordEmail(email: string, data: ResetPasswordEmailProps) {
        const subject = 'Starter project | Reset Password';

        await this.sendMail({ template: 'RESET_PASSWORD_EMAIL', data }, email, subject);
    }

    async sendCompanyCreatedEmail(email: string, data: CompanyCreatedEmailProps) {
        const subject = 'Starter project | Company Onboarded';

        await this.sendMail({ template: 'COMPANY_CREATED_EMAIL', data }, email, subject);
    }

    async sendVerifyRegistrationOTPEmail(email: string, data: SignupEmailVerificationProps) {
        const subject = 'Starter project | Email verification';

        await this.sendMail({ template: 'EMAIL_OTP', data }, email, subject);
    }

    async sendMail({ template, data }: EmailPayload, email: string, subject: string) {
        const emailTemplate = MailTemplates[template](data as any);

        try {
            await this.mailProvider.send({
                from: this.appConfig.email.mailSendFrom,
                to: email,
                subject,
                html: emailTemplate,
            });

            return true;
        } catch (error) {
            this.logger.error(`Failed to send verification email to '${email as string}'`, error.stack);
        }

        return false;
    }
}
