import { Base64Decode } from '@app/utils/string/base64';
import { Injectable } from '@nestjs/common';
import { FacebookOAuthProvider } from './providers/facebook.provider';
import { GoogleOAuthProvider } from './providers/google.provider';
import { VippsOAuthProvider } from './providers/vipps.provider';
import { OAuthProviders } from './types/config.type';
import { OAuthProfileResponse } from './types/provider.type';

@Injectable()
export class OAuthService {
    constructor(
        private readonly google: GoogleOAuthProvider,
        private readonly facebook: FacebookOAuthProvider,
        private vipps: VippsOAuthProvider,
    ) {}

    getRedirectURL(provider: OAuthProviders): string {
        switch (provider) {
            case OAuthProviders.FACEBOOK:
                return this.facebook.getRedirectURL();

            case OAuthProviders.GOOGLE:
                return this.google.getRedirectURL();

            case OAuthProviders.VIPPS:
                return this.vipps.getRedirectURL();

            default:
                throw new Error('Provider not supported');
        }
    }

    async handleRedirect(code: string, state: string): Promise<OAuthProfileResponse> {
        const stateObj = JSON.parse(Base64Decode(state)) as { provider: OAuthProviders };
        const { provider } = stateObj;
        const accessToken = await this.validateCode(provider, code);
        return this.getUserInfo(provider, accessToken);
    }

    private async validateCode(provider: OAuthProviders, code: string): Promise<string> {
        switch (provider) {
            case OAuthProviders.FACEBOOK:
                return this.facebook.validateCode(code);

            case OAuthProviders.GOOGLE:
                return this.google.validateCode(code);

            case OAuthProviders.VIPPS:
                return this.vipps.validateCode(code);

            default:
                throw new Error('Provider not supported');
        }
    }

    private getUserInfo(provider: OAuthProviders, accessToken: string): Promise<OAuthProfileResponse> {
        switch (provider) {
            case OAuthProviders.FACEBOOK:
                return this.facebook.getUserInfo(accessToken);

            case OAuthProviders.GOOGLE:
                return this.google.getUserInfo(accessToken);

            case OAuthProviders.VIPPS:
                return this.vipps.getUserInfo(accessToken);

            default:
                throw new Error('Provider not supported');
        }
    }
}
