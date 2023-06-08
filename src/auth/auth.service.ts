import { SerializeService } from '@app/utils/serializer/serialize.service';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { DecodedIdToken } from 'firebase-admin/lib/auth';
import { InjectModel } from 'nestjs-typegoose';
import { ConfigService } from '../config/config.service';
import { MailService } from '../mail/mail.service';
import { getIdForSuperAdminRole, getIdForUserRole } from '../role/data/roles-seed';
import { UserProfileDto } from '../user/dto/user.dto';
import { AuthProvider, NotificationPlatformsEnum, UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthResponseDto, LoginDto, LogoutDto, RegisterDto, SendRegistrationCodeDto } from './dto/auth-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto, ResetPasswordSendCodeDto, ResetPasswordVerifyCodeDto } from './dto/reset-password.dto';
import { ExpiredTokensEntity } from './entities/expired-tokens';
import { OTPEntity, OTPTypeEnum } from './entities/otp';
import { PendingUserEntity } from './entities/pending-user.entity';

@Injectable()
export class AuthService extends SerializeService<UserEntity> {
    private logger = new Logger(AuthService.name);
    private readonly firebaseLoginTypes: { [key: string]: AuthProvider } = {
        'google.com': AuthProvider.GOOGLE,
        'facebook.com': AuthProvider.FACEBOOK,
        'apple.com': AuthProvider.APPLE,
    };

    private readonly THREE_MINUTE = 1000 * 60 * 3;

    constructor(
        @InjectModel(ExpiredTokensEntity)
        private readonly expiredTokenModel: ReturnModelType<typeof ExpiredTokensEntity>,
        @InjectModel(PendingUserEntity) private readonly pendingUserModel: ReturnModelType<typeof PendingUserEntity>,
        @InjectModel(OTPEntity) private readonly otpModel: ReturnModelType<typeof OTPEntity>,
        private jwtService: JwtService,
        private userService: UserService,
        private mailService: MailService,
        private config: ConfigService,
    ) {
        super(UserEntity);
    }

    async onModuleInit() {
        const user = await this.userService.findByEmail(this.config.adminUserCredential.adminUserEmail);

        if (!user) {
            await this.userService.rawCreate({
                email: this.config.adminUserCredential.adminUserEmail,
                password: await this.userService.getHashedPassword(this.config.adminUserCredential.adminUserPass),
                firstName: 'Admin',
                lastName: '',
                phone: '',
                isEmailVerified: true,
                avatarURL: '',
                authProvider: AuthProvider.EMAIL,
                isActive: true,
                isDeleted: false,
                firebaseSetting: {
                    uid: '',
                    sendNotification: true,
                    notificationTokens: {
                        [NotificationPlatformsEnum.Android]: [],
                        [NotificationPlatformsEnum.IOS]: [],
                        [NotificationPlatformsEnum.Web]: [],
                        [NotificationPlatformsEnum.Other]: [],
                    },
                },
                role: getIdForSuperAdminRole(),
                lastActive: null,
            });
        }
    }

    async adminLogin({ email, password }: LoginDto) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        if (user.isDeleted) throw new BadRequestException('Your user account has been deleted from system');
        if (!user.isActive) throw new BadRequestException('Your user account inactive. Please contact support');

        // todo: check admin role

        if (!(await bcrypt.compare(password, user.password))) throw new BadRequestException('Invalid password');

        return this.getLoginResponse(user);
    }

    async loginByEmail({ email, password }: LoginDto) {
        const user = await this.userService.findOneNormalUser({ email }, ['company']);
        if (!user) throw new NotFoundException('User not found');
        if (user.isDeleted) throw new BadRequestException('Your user account has been deleted from system');
        if (!user.isActive) throw new BadRequestException('Your user account inactive. Please contact support');

        if (!(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Invalid password');
        }

        return this.getLoginResponse(user);
    }

    // sendRegistrationOtp && registerByEmail uncomment & refactor if needed for verification process
    async sendRegistrationOtp(dto: SendRegistrationCodeDto) {
        const user = await this.userService.findOneNormalUser({ email: dto.email });
        if (user) throw new BadRequestException('User already exists');

        const pendingUser = await this.pendingUserModel.findOne({ email: dto.email });
        const token = UserService.generateToken();

        if (pendingUser) {
            const needToWait = new Date(pendingUser.updatedAt as Date).getTime() + this.THREE_MINUTE > Date.now();

            if (needToWait) throw new BadRequestException('Please wait some time to resend code again');

            pendingUser.code = token;
            await pendingUser.save();
        } else {
            await this.pendingUserModel.create({ email: dto.email, code: token });
        }

        // await this.mailService.sendVerificationEmail(user.email, token);

        return 'Code sent';
    }

    async registerByEmail(dto: RegisterDto) {
        if (await this.userService.findOneNormalUser({ email: dto.email }))
            throw new ConflictException('User already verified');

        const pendingUser = await this.pendingUserModel.findOneAndDelete({ email: dto.email, code: dto.code });
        if (!pendingUser) throw new BadRequestException('Verification code does not match');

        dto.password = await this.userService.getHashedPassword(dto.password);

        const user = await this.userService.normalUserCreate({
            ...dto,
            authProvider: AuthProvider.EMAIL,
            avatarURL: '',
            uid: '',
        });

        // await this.mailService.sendVerificationEmail(user.email, token);
        // await this.mailService.sendAccountCreatedEmail(userEntity.email);

        return this.getLoginResponse(user);
    }

    // public async loginBySocial(dto: FirebaseAuthTokenDto) {
    //     try {
    //         const firebaseUser = await this.firebaseAuthenticationService.verifyIdToken(dto.token, true);
    //
    //         // added displayName support for apple as we are not getting by verifyIdToken method
    //         // from app dev managed to send displayName by creating manually. auto also not works for any of these methods
    //         if (firebaseUser.firebase.sign_in_provider === 'apple.com') {
    //             const { displayName } = await this.firebaseAuthenticationService.getUser(firebaseUser.uid);
    //
    //             firebaseUser.displayName = displayName;
    //         }
    //
    //         const { name, email, uid, authProvider, avatarURL } = this.mapFirebaseUser(firebaseUser);
    //
    //         let user = await this.userService.findOneNormalUser({ email: email as string }, ['company']);
    //         if (!user) {
    //             user = await this.userService.normalUserCreate({
    //                 firstName: name,
    //                 lastName: '',
    //                 email,
    //                 uid,
    //                 avatarURL,
    //                 authProvider,
    //                 password: '',
    //                 phone: '',
    //             });
    //         } else {
    //             if (user.isDeleted) throw new BadRequestException('Your user account has been deleted from system');
    //             if (!user.isActive) throw new BadRequestException('Your user account inactive. Please contact support');
    //
    //             // update user's name if needed
    //             // user.name = name;
    //             // await user.save();
    //         }
    //
    //         return this.getLoginResponse(user);
    //     } catch (error) {
    //         if (error instanceof BadRequestException) console.log(error);
    //
    //         const errorMessage = error?.errorInfo?.message;
    //         this.logger.error(errorMessage || 'Invalid Firebase token!');
    //         throw new BadRequestException('Invalid Firebase token');
    //     }
    // }

    public mapFirebaseUser(firebaseUser: DecodedIdToken) {
        const { displayName: name, email, picture: avatarURL, uid, firebase } = firebaseUser;

        if (email) {
            return {
                name,
                email,
                uid,
                avatarURL: avatarURL || '',
                authProvider: this.firebaseLoginTypes[firebase.sign_in_provider],
            };
        }

        throw new BadRequestException('');
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        if (dto.newPassword !== dto.confirmNewPassword) throw new BadRequestException('Passwords does not match');

        const user = await this.userService.findByID(userId);
        if (!user) throw new NotFoundException('User not found');
        if (!user.role?._id?.equals(getIdForUserRole())) throw new NotFoundException('User not found');
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Password change only allowed for register by email user');

        if (!bcrypt.compareSync(dto.oldPassword, user.password))
            throw new BadRequestException('Incorrect old password');

        user.password = await this.userService.getHashedPassword(dto.newPassword);
        await user.save();

        return 'Password changed successful';
    }

    async resetPasswordSendCode(dto: ResetPasswordSendCodeDto) {
        const user = await this.userService.findOneNormalUser({ email: dto.email });
        if (!user) throw new NotFoundException('User not found');
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Reset password only works with email registration');

        const token = UserService.generateToken();

        const otp = await this.otpModel.findOne({ email: dto.email, type: OTPTypeEnum.RESET_PASS });
        if (otp) {
            const needToWait = new Date(otp.createdAt as Date).getTime() + this.THREE_MINUTE > Date.now();
            if (needToWait) throw new BadRequestException('Please wait some time to resend code again');

            otp.code = token;
            otp.createdAt = new Date();
            await otp.save({ timestamps: { createdAt: false } });
        } else {
            await this.otpModel.create({
                email: dto.email,
                code: token,
                isVerified: false,
                type: OTPTypeEnum.RESET_PASS,
            });
        }

        await this.mailService.sendResetPasswordEmail(user.email, { otp: token });

        return 'OTP sent';
    }

    async resetPasswordVerifyCode(dto: ResetPasswordVerifyCodeDto) {
        const user = await this.userService.findOneNormalUser({ email: dto.email });
        if (!user) throw new NotFoundException('User not found');

        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Resend verification code only works with email registration');

        const otp = await this.otpModel.findOneAndUpdate(
            {
                email: dto.email,
                code: dto.code,
                type: OTPTypeEnum.RESET_PASS,
            },
            { isVerified: true },
        );
        if (!otp) throw new BadRequestException('Invalid password reset code');

        return 'OTP verified';
    }

    async resetPassword(dto: ResetPasswordDto) {
        if (dto.newPassword !== dto.confirmNewPassword) throw new BadRequestException('Passwords does not match');

        const user = await this.userService.findOneNormalUser({ email: dto.email });
        if (!user) throw new NotFoundException('User not found');
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Reset password only works with email registration');

        const otp = await this.otpModel.findOneAndDelete({
            email: dto.email,
            code: dto.code,
            type: OTPTypeEnum.RESET_PASS,
            isVerified: true,
        });
        if (!otp) throw new BadRequestException('Please verify password reset code first');

        user.password = await this.userService.getHashedPassword(dto.newPassword);
        await user.save();

        return 'Password reset successful';
    }

    // async changeEmailSendCode(userId: string) {
    //     const user = await this.userService.findByID(userId);
    //     if (!user || !user.role?._id?.equals(getIdForUserRole())) throw new NotFoundException('User not found');
    //     if (user.authProvider !== AuthProvider.EMAIL)
    //         throw new BadRequestException('Change email only works with email registration');
    //
    //     const token = UserService.generateToken();
    //
    //     const otp = await this.otpModel.findOne({ email: user.email, type: OTPTypeEnum.EMAIL_CHANGE });
    //     if (otp) {
    //         const needToWait = new Date(otp.createdAt as Date).getTime() + this.THREE_MINUTE > Date.now();
    //         if (needToWait) throw new BadRequestException('Please wait some time to resend code again');
    //
    //         otp.code = token;
    //         otp.createdAt = new Date();
    //         await otp.save({ timestamps: { createdAt: false } });
    //     } else {
    //         await this.otpModel.create({
    //             email: user.email,
    //             code: token,
    //             isVerified: false,
    //             type: OTPTypeEnum.EMAIL_CHANGE,
    //         });
    //     }
    //
    //     // await this.mailService.sendEmailAddressChangeEmail(user.email, token);
    //
    //     return 'OTP sent';
    // }
    //
    // async changeEmailVerifyCode(userId: string, dto: ChangeEmailVerifyCodeDto) {
    //     const user = await this.userService.findByID(userId);
    //     if (!user || !user.role?._id?.equals(getIdForUserRole())) throw new NotFoundException('User not found');
    //     if (user.authProvider !== AuthProvider.EMAIL)
    //         throw new BadRequestException('Change email only works with email registration');
    //
    //     const otp = await this.otpModel.findOneAndUpdate(
    //         {
    //             email: user.email,
    //             code: dto.code,
    //             type: OTPTypeEnum.EMAIL_CHANGE,
    //         },
    //         { isVerified: true },
    //     );
    //     if (!otp) throw new BadRequestException('Invalid email change code');
    //
    //     return 'OTP verified';
    // }
    //
    // async changeEmailSendCodeForNewEmail(userId: string, dto: ChangeEmailSendCodeForNewEmailDto) {
    //     const user = await this.userService.findByID(userId);
    //     if (!user || !user.role?._id?.equals(getIdForUserRole())) throw new NotFoundException('User not found');
    //     if (user.authProvider !== AuthProvider.EMAIL)
    //         throw new BadRequestException('Change email only works with email registration');
    //
    //     const findExisting = await this.userService.findByEmail(dto.email);
    //     if (findExisting) throw new ConflictException('A user already exists with this email');
    //
    //     const changeEmailOtp = await this.otpModel.findOneAndDelete({
    //         email: user.email,
    //         type: OTPTypeEnum.EMAIL_CHANGE,
    //         isVerified: true,
    //     });
    //     if (!changeEmailOtp) throw new BadRequestException('Please verify change email code first');
    //
    //     const token = UserService.generateToken();
    //
    //     const otp = await this.otpModel.findOne({ email: dto.email, type: OTPTypeEnum.EMAIL_CHANGE_VERIFY_EMAIL });
    //     if (otp) {
    //         const needToWait = new Date(otp.createdAt as Date).getTime() + this.THREE_MINUTE > Date.now();
    //         if (needToWait) throw new BadRequestException('Please wait some time to resend code again');
    //
    //         otp.code = token;
    //         otp.createdAt = new Date();
    //         await otp.save({ timestamps: { createdAt: false } });
    //     } else {
    //         await this.otpModel.create({
    //             email: dto.email,
    //             code: token,
    //             isVerified: false,
    //             type: OTPTypeEnum.EMAIL_CHANGE_VERIFY_EMAIL,
    //         });
    //     }
    //
    //     // await this.mailService.sendVerificationEmail(dto.email, token);
    //
    //     return 'OTP sent';
    // }
    //
    // async changeEmailVerifyCodeForNewEmail(userId: string, dto: ChangeEmailVerifyCodeForNewEmailDto) {
    //     const user = await this.userService.findByID(userId);
    //     if (!user || !user.role?._id?.equals(getIdForUserRole())) throw new NotFoundException('User not found');
    //     if (user.authProvider !== AuthProvider.EMAIL)
    //         throw new BadRequestException('Change email only works with email registration');
    //
    //     const otp = await this.otpModel.findOneAndUpdate(
    //         {
    //             email: dto.email,
    //             code: dto.code,
    //             type: OTPTypeEnum.EMAIL_CHANGE_VERIFY_EMAIL,
    //         },
    //         { isVerified: true },
    //     );
    //     if (!otp) throw new BadRequestException('Invalid email verify code');
    //
    //     return 'OTP verified';
    // }
    //
    // async changeEmail(userId: string, token: string, dto: ChangeEmailDto) {
    //     const user = await this.userService.findByID(userId);
    //     if (!user) throw new NotFoundException('User not found');
    //     if (user.authProvider !== AuthProvider.EMAIL)
    //         throw new BadRequestException('Change email address only works with email registration');
    //
    //     const findExisting = await this.userService.findByEmail(dto.email);
    //     if (findExisting) throw new ConflictException('A user already exists with this email');
    //
    //     const otp = await this.otpModel.findOneAndDelete({
    //         email: dto.email,
    //         type: OTPTypeEnum.EMAIL_CHANGE_VERIFY_EMAIL,
    //         isVerified: true,
    //     });
    //     if (!otp) throw new BadRequestException('Email is not verified');
    //
    //     user.email = dto.email;
    //     await user.save();
    //
    //     await this.expiredTokenModel.create({ token, userId: userId, type: ExpiredTokenTypeEnum.ACCESS_TOKEN });
    //
    //     return 'Email change successful';
    // }

    async logout(userId: string, dto: LogoutDto) {
        await this.userService.deleteFirebaseNotificationToken(userId, dto.notificationToken);

        return true;
    }

    async getLoginResponse(user: DocumentType<UserEntity>): Promise<AuthResponseDto> {
        const accessToken = await this.jwtService.signAsync(
            { id: user._id, type: 'access_token' },
            { expiresIn: this.config.jwt.accessTokenExpiresIn },
        );
        const refreshToken = await this.jwtService.signAsync(
            { id: user._id, type: 'refresh_token' },
            { expiresIn: this.config.jwt.refreshTokenExpiresIn },
        );

        return {
            accessToken,
            refreshToken,
            user: this.toJSON(user, UserProfileDto),
        };
    }

    public async refreshJwtToken(dto: RefreshTokenDto) {
        const refreshTokenData = await this.jwtService.verifyAsync(dto.refreshToken);
        if (refreshTokenData.type !== 'refresh_token') throw new BadRequestException('Invalid refresh token');

        const user = await this.userService.findByID(refreshTokenData.id);
        if (!user) throw new NotFoundException('User not found');

        return this.getLoginResponse(user);
    }
}
