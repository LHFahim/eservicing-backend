import { FC } from 'react';
import { EmailWrapper } from './components/EmailWrapper';

export type ResetPasswordEmailProps = {
    otp: string;
};

export const ResetPasswordEmail: FC<ResetPasswordEmailProps> = ({ otp }) => {
    return (
        <EmailWrapper title="Rest Your Password">
            <>
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: '32px',
                        lineHeight: '42px',
                        textAlign: 'center',
                        marginBottom: '20px',
                    }}
                >
                    Reset your password
                </div>
                <div style={{ fontWeight: 400, fontSize: '16px', lineHeight: '24px', textAlign: 'center' }}>
                    To reset your account password please use this code
                </div>
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
                    {otp}
                </div>
                <div style={{ textAlign: 'center' }}>
                    If you didn't request for reset password, you can ignore this email
                </div>
            </>
        </EmailWrapper>
    );
};
