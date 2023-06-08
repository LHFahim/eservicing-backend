import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    oldPassword: string;

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
