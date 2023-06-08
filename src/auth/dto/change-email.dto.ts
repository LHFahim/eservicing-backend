import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailVerifyCodeDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class ChangeEmailSendCodeForNewEmailDto extends PickType(UserEntity, ['email']) {}
export class ChangeEmailVerifyCodeForNewEmailDto extends PickType(UserEntity, ['email']) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class ChangeEmailDto extends PickType(UserEntity, ['email']) {}
