import { ComponentProps } from 'react';

import { renderToStaticMarkup } from 'react-dom/server';
import { SignupVerifyEmail } from './verify-email';

import { WelcomeEmail } from './welcome';
import { CompanyCreatedEmail } from './company-created-email';
import { ResetPasswordEmail } from './reset-password-email';

export const MailTemplates = {
    EMAIL_OTP: (props: ComponentProps<typeof SignupVerifyEmail>) =>
        renderToStaticMarkup(<SignupVerifyEmail {...props} />),

    WELCOME_EMAIL: (props: ComponentProps<typeof WelcomeEmail>) => renderToStaticMarkup(<WelcomeEmail {...props} />),

    RESET_PASSWORD_EMAIL: (props: ComponentProps<typeof ResetPasswordEmail>) =>
        renderToStaticMarkup(<ResetPasswordEmail {...props} />),

    COMPANY_CREATED_EMAIL: (props: ComponentProps<typeof CompanyCreatedEmail>) =>
        renderToStaticMarkup(<CompanyCreatedEmail {...props} />),
} as const;

export type EmailPayload = {
    [key in keyof typeof MailTemplates]: {
        template: key;
        data: Parameters<typeof MailTemplates[key]>[0];
    };
}[keyof typeof MailTemplates];
