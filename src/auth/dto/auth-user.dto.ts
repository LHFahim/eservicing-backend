import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Roles } from '../../common';
import { UserLiteDto } from '../../user/dto/user.dto';
import { UserEntity } from '../../user/entities/user.entity';

export class RegisterDto extends PickType(UserEntity, ['firstName', 'lastName', 'email', 'phone']) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    code: string;
}

export class LoginDto extends PickType(UserEntity, ['email']) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @Expose()
    password: string;
}

export class VerifyJoinCodeDto {
    @IsString()
    @IsNotEmpty()
    joinCode: string;
}

export class AuthUserDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    roleName: Roles;
}

export class FirebaseAuthTokenDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    @Expose()
    token: string;
}

export class AuthResponseDto {
    @Expose()
    accessToken: string;

    @Expose()
    refreshToken: string;

    @Expose()
    user: UserLiteDto;
}

export class SendRegistrationCodeDto extends PickType(UserEntity, ['firstName', 'email']) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

export class LogoutDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    notificationToken: string;
}
