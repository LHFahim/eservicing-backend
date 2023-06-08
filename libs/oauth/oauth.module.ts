import { AtLeastOne } from '@app/utils/types';
import { DynamicModule, Module, Type } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { FacebookOAuthProvider } from './providers/facebook.provider';
import { GoogleOAuthProvider } from './providers/google.provider';
import { VippsOAuthProvider } from './providers/vipps.provider';
import { OAuthConfig } from './types/config.type';

type OAuthConfigProvider = {
    useValue?: OAuthConfig;
    useExisting?: OAuthConfig;
    useFactory?: (...args: any[]) => OAuthConfig;
    inject?: any[];
    useClass?: Type<OAuthConfig>;
};

@Module({})
export class OAuthModule {
    static defaultProviders = [OAuthService, GoogleOAuthProvider, FacebookOAuthProvider, VippsOAuthProvider];

    static forFeatureAsync({
        useExisting,
        useValue,
        useFactory,
        inject,
        useClass,
    }: AtLeastOne<OAuthConfigProvider>): DynamicModule {
        return {
            module: OAuthModule,
            providers: [
                ...OAuthModule.defaultProviders,
                {
                    provide: OAuthConfig,
                    useValue,
                    inject,
                    useFactory,
                    useExisting,
                    useClass,
                } as any,
            ],
            exports: [OAuthService, OAuthConfig],
        };
    }

    static forFeature(config: OAuthConfig) {
        return {
            module: OAuthModule,
            providers: [
                ...OAuthModule.defaultProviders,
                {
                    provide: OAuthConfig,
                    useValue: config,
                },
            ],
            exports: [OAuthService, OAuthConfig],
        };
    }
}
