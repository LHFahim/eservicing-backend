import { Serialize } from '@app/utils';
import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { APIVersions, ControllersEnum, Routes } from '../common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AccessToken, UserId } from '../common/decorators/user.decorator';
import { FirebaseAuthTokenDto, LoginDto, LogoutDto, RegisterDto, VerifyJoinCodeDto } from './dto/auth-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto, ResetPasswordSendCodeDto, ResetPasswordVerifyCodeDto } from './dto/reset-password.dto';
import {
    ChangeEmailDto,
    ChangeEmailSendCodeForNewEmailDto,
    ChangeEmailVerifyCodeDto,
    ChangeEmailVerifyCodeForNewEmailDto,
} from './dto/change-email.dto';

@ApiTags('Auth')
@Serialize()
@Controller({ path: ControllersEnum.Auth, version: APIVersions.V1 })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post(Routes[ControllersEnum.Auth].registerByEmail)
    async registerByEmail(@Body() dto: RegisterDto) {
        return this.authService.registerByEmail(dto);
    }

    // @Post(Routes[ControllersEnum.Auth].registerBySocial)
    // async registerBySocial(@Body() dto: FirebaseAuthTokenDto) {
    //     return this.authService.registerBySocial(dto);
    // }

    @Post(Routes[ControllersEnum.Auth].loginByEmail)
    async loginByEmail(@Body() dto: LoginDto) {
        return this.authService.loginByEmail(dto);
    }

    // @Post(Routes[ControllersEnum.Auth].loginBySocial)
    // async loginBySocial(@Body() dto: FirebaseAuthTokenDto) {
    //     return this.authService.loginBySocial(dto);
    // }

    @Post(Routes[ControllersEnum.Auth].refreshJwtToken)
    async refreshJwtToken(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshJwtToken(dto);
    }

    // @Post(Routes[ControllersEnum.Auth].sendRegistrationOtp)
    // async sendRegistrationOtp(@Body() dto: SendRegistrationCodeDto) {
    //     return this.authService.sendRegistrationOtp(dto);
    // }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(Routes[ControllersEnum.Auth].changePassword)
    async changePassword(@UserId() userId: string, @Body() dto: ChangePasswordDto) {
        return this.authService.changePassword(userId, dto);
    }

    @Post(Routes[ControllersEnum.Auth].resetPasswordSendCode)
    async resetPasswordSendCode(@Body() body: ResetPasswordSendCodeDto) {
        return this.authService.resetPasswordSendCode(body);
    }

    @Post(Routes[ControllersEnum.Auth].resetPasswordVerifyCode)
    async resetPasswordVerifyCode(@Body() body: ResetPasswordVerifyCodeDto) {
        return this.authService.resetPasswordVerifyCode(body);
    }

    @Patch(Routes[ControllersEnum.Auth].resetPassword)
    async resetPassword(@Body() body: ResetPasswordDto) {
        return this.authService.resetPassword(body);
    }

    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Post(Routes[ControllersEnum.Auth].changeEmailSendCode)
    // async changeEmailSendCode(@UserId() userId: string) {
    //     return this.authService.changeEmailSendCode(userId);
    // }
    //
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Post(Routes[ControllersEnum.Auth].changeEmailVerifyCode)
    // async changeEmailVerifyCode(@UserId() userId: string, @Body() body: ChangeEmailVerifyCodeDto) {
    //     return this.authService.changeEmailVerifyCode(userId, body);
    // }
    //
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Post(Routes[ControllersEnum.Auth].changeEmailSendCodeForNewEmail)
    // async changeEmailSendCodeForNewEmail(@UserId() userId: string, @Body() body: ChangeEmailSendCodeForNewEmailDto) {
    //     return this.authService.changeEmailSendCodeForNewEmail(userId, body);
    // }
    //
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Post(Routes[ControllersEnum.Auth].changeEmailVerifyCodeForNewEmail)
    // async changeEmailVerifyCodeForNewEmail(
    //     @UserId() userId: string,
    //     @Body() body: ChangeEmailVerifyCodeForNewEmailDto,
    // ) {
    //     return this.authService.changeEmailVerifyCodeForNewEmail(userId, body);
    // }
    //
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Patch(Routes[ControllersEnum.Auth].changeEmail)
    // async changeEmail(@UserId() userId: string, @AccessToken() token: string, @Body() body: ChangeEmailDto) {
    //     return this.authService.changeEmail(userId, token, body);
    // }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(Routes[ControllersEnum.Auth].logout)
    async logout(@UserId() userId: string, @Body() body: LogoutDto) {
        return this.authService.logout(userId, body);
    }
}
