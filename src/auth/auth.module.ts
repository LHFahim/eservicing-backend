import { Global, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypegooseModule } from 'nestjs-typegoose';
import { PendingUserEntity } from './entities/pending-user.entity';
import { OTPEntity } from './entities/otp';
import { ExpiredTokensEntity } from './entities/expired-tokens';

@Global()
@Module({
    imports: [
        TypegooseModule.forFeature([ExpiredTokensEntity, PendingUserEntity, OTPEntity]),
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => ({
                secret: config.jwt.secret,
            }),
            inject: [ConfigService],
        }),
        MailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, RoleGuard, JwtStrategy],
    exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
