import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaginationDto } from '../../common';
import { UserEntity } from '../entities/user.entity';

export class UserProfileDto extends OmitType(UserEntity, ['password']) {}
export class UserLiteDto extends PickType(UserEntity, [
    '_id',
    'email',
    'isEmailVerified',
    'authProvider',
    'createdAt',
    'updatedAt',
    'phone',
    'firstName',
    'lastName',
]) {}

export class UpdateUserDto extends PartialType(OmitType(UserEntity, ['_id', 'email', 'createdAt', 'updatedAt'])) {}

export enum NotificationTokenEnum {
    android = 'android',
    ios = 'ios',
    web = 'web',
}
export class UpdateFirebaseNotificationDto {
    @Expose()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsEnum(NotificationTokenEnum)
    deviceType: NotificationTokenEnum;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    token: string;
}

export class UserForAdminDto extends OmitType(UserEntity, ['password', 'firebaseSetting']) {}

export class PaginatedUserForAdminDto {
    @Expose()
    @ApiProperty({ type: [UserForAdminDto] })
    items: UserForAdminDto[];

    @Expose()
    @ApiProperty({ type: PaginationDto })
    pagination: PaginationDto;
}
