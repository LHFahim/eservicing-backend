import { FC } from 'react';
import { EmailWrapper } from './components/EmailWrapper';

export type SignupEmailVerificationProps = {
    otp: string;
};

export const SignupVerifyEmail: FC<SignupEmailVerificationProps> = ({ otp }) => {
    return (
        <EmailWrapper title="Verify your email">
            <h1>Your OTP Code is {otp}</h1>
        </EmailWrapper>
    );
};
