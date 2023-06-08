import { FC } from 'react';
import { EmailWrapper } from './components/EmailWrapper';

export type WelcomeProps = {
    name: string;
};

export const WelcomeEmail: FC<WelcomeProps> = ({ name }) => {
    return (
        <EmailWrapper title="Welcome to App">
            <h1>Hello {name} 👋 Welcome to our app</h1>
        </EmailWrapper>
    );
};
