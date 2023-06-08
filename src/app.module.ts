import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { TypegooseModule } from 'nestjs-typegoose';
import * as path from 'path';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

// import { StorageModule } from '@app/storage';

@Module({
    imports: [
        ConfigModule,

        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
                watch: true,
            },
            resolvers: [AcceptLanguageResolver],
        }),
        TypegooseModule.forRootAsync({
            useFactory: (config: ConfigService) => ({ uri: config.mongoDBURL }),
            inject: [ConfigService],
        }),
        // StorageModule.forRootAsync({
        //     useFactory: (_config: ConfigService) => {
        //         console.log(_config);
        //         return {
        //             accessKeyId: _config.amazonS3.accessKey,
        //             bucket: _config.amazonS3.bucketId,
        //             domainName: _config.amazonS3.domainName,
        //             secretAccessKey: _config.amazonS3.secretKey,
        //         };
        //     },
        //     inject: [ConfigService],
        // }),
        ScheduleModule.forRoot(),

        RoleModule,
        PermissionModule,

        AuthModule,
        UserModule,

        AdminModule,
    ],
    controllers: [],
})
export class AppModule {}
