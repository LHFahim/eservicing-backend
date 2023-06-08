import { DocumentCTWithTimeStamps, Model } from '@app/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { RoleDto } from '../../role/dto/role.dto';
import { RoleEntity } from '../../role/entities/role.entity';

export enum AuthProvider {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE',
    APPLE = 'APPLE',
    FACEBOOK = 'FACEBOOK',
}

export enum NotificationPlatformsEnum {
    Android = 'android',
    IOS = 'ios',
    Web = 'web',
    Other = 'other',
}

export class NotificationTokens {
    @ApiProperty({ required: false, type: String, isArray: true })
    @IsArray()
    @Expose()
    @Prop({ type: () => [String], required: false, default: [] })
    [NotificationPlatformsEnum.Android]: string[];

    @ApiProperty({ required: false, type: String, isArray: true })
    @IsArray()
    @Expose()
    @Prop({ type: () => [String], required: false, default: [] })
    [NotificationPlatformsEnum.IOS]: string[];

    @ApiProperty({ required: false, type: String, isArray: true })
    @IsArray()
    @Expose()
    @Prop({ type: () => [String], required: false, default: [] })
    [NotificationPlatformsEnum.Web]: string[];

    @ApiProperty({ required: false, type: String, isArray: true })
    @IsArray()
    @Expose()
    @Prop({ type: () => [String], required: false, default: [] })
    [NotificationPlatformsEnum.Other]: string[];
}

class FirebaseSetting {
    @Expose()
    @ApiProperty({ type: NotificationTokens })
    @Type(() => NotificationTokens)
    @Prop({ type: () => NotificationTokens, _id: false })
    notificationTokens: NotificationTokens;

    @Expose()
    @ApiProperty({ type: Boolean })
    @Prop({ required: true, type: Boolean, default: true })
    sendNotification: boolean;

    @Expose()
    @Prop({ required: false, type: String })
    uid: string;
}

@Model('users', true)
export class UserEntity extends DocumentCTWithTimeStamps {
    @ApiProperty({ required: true })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Prop({ required: false, trim: true, default: () => '' })
    firstName: string;

    @ApiProperty({ required: true })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Prop({ required: false, trim: true, default: () => '' })
    lastName: string;

    @ApiProperty({ required: true })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    @Prop({ required: true, trim: true })
    @Transform(({ value }) => value?.toLowerCase())
    email: string;

    @Prop({ required: false })
    password: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: false, trim: true, default: () => '' })
    phone: string;

    @ApiProperty({ required: true })
    @Expose()
    @Prop({ default: null })
    avatarURL: string;

    @Expose()
    @ApiProperty({ required: false, enum: AuthProvider })
    @Prop({ required: true, enum: AuthProvider })
    authProvider: AuthProvider;

    @Expose()
    @Prop({ required: false, type: () => FirebaseSetting, _id: false, default: {} })
    @Type(() => FirebaseSetting)
    firebaseSetting: FirebaseSetting;

    @Expose()
    @Prop({ required: true, ref: () => RoleEntity })
    @Type(() => RoleDto)
    role: Ref<RoleEntity>;

    @Expose()
    @Prop({ required: false, type: Boolean, default: true })
    isEmailVerified: boolean;

    @Expose()
    @Prop({ required: false, type: Date, default: null })
    lastActive: Date | null;

    @Expose()
    @Prop({ required: false, type: Boolean, default: true })
    isActive: boolean;

    @Expose()
    @Prop({ required: false, type: Boolean, default: false })
    isDeleted: boolean;
}
