import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';

export class ResetPasswordSendCodeDto extends PickType(UserEntity, ['email']) {}
export class ResetPasswordVerifyCodeDto extends PickType(UserEntity, ['email']) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class ResetPasswordDto extends PickType(UserEntity, ['email']) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    confirmNewPassword: string;
}
