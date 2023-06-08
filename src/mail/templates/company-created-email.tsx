import { FC } from 'react';
import { EmailWrapper } from './components/EmailWrapper';

export type CompanyCreatedEmailProps = {
    email: string;
    userName: string;
    companyName: string;
    pass: string;
    joinCode: string;
    appLink: string;
};

export const CompanyCreatedEmail: FC<CompanyCreatedEmailProps> = ({
    userName,
    email,
    companyName,
    pass,
    joinCode,
    appLink,
}) => {
    return (
        <EmailWrapper title="Company created">
            <div
                style={{
                    fontWeight: 600,
                    fontSize: '32px',
                    lineHeight: '42px',
                    textAlign: 'center',
                    marginBottom: '20px',
                }}
            >
                Hello {userName}
            </div>

            <p style={{ fontWeight: 400, fontSize: '16px', lineHeight: '24px' }}>
                <div style={{ marginBottom: '5px' }}>
                    Company <b>{companyName}</b> and a user access has been created by system to use Jamit APP. To
                    access the admin panel use:
                </div>
                <div>
                    Email: <b>{email}</b>
                </div>
                <div>
                    Password: <b>{pass}</b>
                </div>
            </p>

            <p style={{ fontWeight: 600, fontSize: '17px', lineHeight: '24px', textAlign: 'center' }}>
                User can onboard for your company to use Jamit App. Please send below code to user
            </p>
            <div
                style={{
                    backgroundColor: '#F6F1EB',
                    border: '1px solid #FCDED0',
                    borderRadius: '4px',
                    padding: '45px 5px',
                    fontSize: '56px',
                    fontWeight: '700',
                    textAlign: 'center',
                    margin: '50px 0',
                    letterSpacing: '16px',
                }}
            >
                {joinCode}
            </div>
            <div style={{ textAlign: 'center', fontSize: '15px' }}>
                Otherwise users can use this <a href={appLink}>App Link</a> for onboarding
            </div>
        </EmailWrapper>
    );
};
