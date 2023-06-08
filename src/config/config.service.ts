import { Injectable } from '@nestjs/common';
import { Env, Section } from 'atenv';
import { Transform } from 'class-transformer';
import { IsDefined, IsOptional } from 'class-validator';

class AmazonS3 {
    @Env('S3_ACCESS_KEY')
    @IsOptional()
    accessKey: string;

    @Env('S3_SECRET_KEY')
    @IsOptional()
    secretKey: string;

    @Env('S3_BUCKET_ID')
    @IsOptional()
    bucketId: string;

    @Env('S3_DOMAIN_NAME')
    @IsOptional()
    domainName: string;
}

class Firebase {
    @Env('FIREBASE_PRIVATE_KEY')
    @IsOptional()
    privateKey: string;

    @Env('FIREBASE_CLIENT_EMAIL')
    @IsOptional()
    clientEmail: string;

    @Env('FIREBASE_PROJECT_ID')
    @IsOptional()
    projectId: string;

    @Env('FIREBASE_WEB_API_KEY')
    @IsOptional()
    webApiKey: string;

    @Env('FIREBASE_DYNAMIC_LINK_DOMAIN_URI')
    @IsOptional()
    dynamicLinkDomainUri: string;

    @Env('ANDROID_PACKAGE_NAME')
    @IsOptional()
    androidPackageName: string;

    @Env('IOS_BUNDLE_ID')
    @IsOptional()
    iosBundleId: string;

    @Env('IOS_STORE_ID')
    @IsOptional()
    iosStoreId: string;
}

class Sendgrid {
    @IsOptional()
    @Env('SENDGRID_API_KEY')
    apiKey: string;

    @IsOptional()
    @Env('MAIL_SEND_FROM')
    mailSendFrom: string;
}

class JWTSettings {
    @IsDefined({ message: 'JWT  secret is required in .env file' })
    @Env('JWT_SECRET')
    secret: string;

    @IsDefined({
        message: 'JWT access token `expires in` is required in .env file',
    })
    @Env('JWT_ACCESS_TOKEN_EXPIRES_IN')
    accessTokenExpiresIn: string;

    @IsDefined({
        message: 'JWT refresh token `expires in` is required in .env file',
    })
    @Env('JWT_REFRESH_TOKEN_EXPIRES_IN')
    refreshTokenExpiresIn: string;
}

class Redis {
    @IsOptional()
    @Env('REDIS_HOST')
    redisHost: string;

    @IsOptional()
    @Env('REDIS_PORT')
    redisPort: number;

    @IsOptional()
    @Env('REDIS_DB')
    redisDB: number;
}

class Email {
    @IsDefined()
    @Env('MAIL_SEND_FROM')
    mailSendFrom: string;
}

class AdminUserCredentials {
    @IsDefined({ message: 'Admin user email is required in .env file' })
    @Env('ADMIN_EMAIL')
    adminUserEmail: string;

    @IsDefined({
        message: 'Admin user password is required in .env file',
    })
    @Env('ADMIN_PASSWORD')
    adminUserPass: string;
}

@Injectable()
export class ConfigService {
    @Env('PORT')
    @Transform(({ value }) => parseInt(value) || 3000)
    port = 3000;

    @Env('MONGODB_URL')
    mongoDBURL = 'mongodb://localhost:27017/starter-project';

    @Section(() => JWTSettings)
    jwt: JWTSettings;

    @Section(() => Redis)
    redis: Redis;

    @Section(() => Sendgrid)
    sendgrid: Sendgrid;

    @Section(() => AmazonS3)
    amazonS3: AmazonS3;

    @Section(() => Firebase)
    firebase: Firebase;

    @Section(() => Email)
    email: Email;

    @Section(() => AdminUserCredentials)
    adminUserCredential: AdminUserCredentials;

    @IsOptional()
    @Env('ADMIN_FRONTEND_URL')
    adminFrontendUrl = 'http://127.0.0.1:8000';

    @IsOptional()
    @Env('FE_HOST_ADDRESS')
    frontendHostAddress = 'http://127.0.0.1:8000';

    @Env('NODE_ENV')
    nodeEnv: string;

    isProd() {
        return this.nodeEnv === 'production';
    }
}
