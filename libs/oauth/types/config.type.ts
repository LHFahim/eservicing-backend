import { Injectable } from '@nestjs/common';

export class OAuthServiceConfig {
    clientID: string;
    clientSecret: string;
}

@Injectable()
export class OAuthConfig {
    google: OAuthServiceConfig;
    facebook: OAuthServiceConfig;
    vipps: OAuthServiceConfig;
    redirectURL: string;
}

export enum OAuthProviders {
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    VIPPS = 'vipps',
}
