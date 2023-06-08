import { SerializeService } from '@app/utils/serializer/serialize.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { UserActivationQuery } from '../admin/user/dto/admin-user.dto';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { PaginationQueryDto } from '../common';
import { getIdForUserRole } from '../role/data/roles-seed';
import {
    PaginatedUserForAdminDto,
    UpdateFirebaseNotificationDto,
    UserForAdminDto,
    UserProfileDto,
} from './dto/user.dto';
import { AuthProvider, NotificationPlatformsEnum, UserEntity } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserNotFoundException } from './users.exceptions';

export interface UserCreatePayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    avatarURL: string;
    authProvider: AuthProvider;
    uid: string;
    phone: string;
}

@Injectable()
export class UserService extends SerializeService<UserEntity> {
    constructor(private readonly userRepo: UserRepository) {
        super(UserEntity);
    }

    async findOneNormalUser(query: FilterQuery<UserEntity>, populate: string[] = []) {
        return this.userRepo.findOne(
            {
                ...query,
                role: getIdForUserRole(),
            },
            populate,
        );
    }

    async findByEmail(email: string) {
        return await this.userRepo.findOne({ email });
    }

    async findByID(_id: string, populate: string[] = []) {
        return await this.userRepo.findOne({ _id }, populate);
    }

    async rawCreate(user: UserEntity) {
        return this.userRepo.create(user);
    }

    async normalUserCreate({
        avatarURL,
        email,
        password,
        firstName,
        lastName,
        authProvider,
        phone,
    }: UserCreatePayload) {
        const user = await this.userRepo.findOne({
            email,
            role: getIdForUserRole(),
        });
        if (user) throw new ConflictException('User already exists');

        const createdUser = await this.rawCreate({
            avatarURL,
            email,
            firstName,
            lastName,
            phone,
            authProvider,
            password,
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
            role: getIdForUserRole(),
            lastActive: null,
            isEmailVerified: true,
            isActive: true,
            isDeleted: false,
        });

        return (await this.findOneNormalUser({ _id: createdUser._id }, ['company']))!;
    }

    async assignCompanyToUser(userId: string, companyId: string) {
        const user = await this.userRepo.updateRaw({ _id: userId, company: null }, { company: companyId }, ['company']);
        if (!user) throw new NotFoundException('User is already assigned to company by join code');

        return this.toJSON(user, UserProfileDto);
    }

    // async updateAvatar(userId: string, image: Buffer) {
    //     const optimized = await optimizeImage(image, { height: 1024, width: 1024 });
    //     const url = await this.storageService.upload('avatars', `${Date.now()}.webp`, optimized);
    //
    //     const user = await this.userRepo.update(userId, { avatarURL: url });
    //     if (!user) throw new NotFoundException('User not found');
    //
    //     return this.toJSON(user, UserProfileDto);
    // }

    async getMyProfile(userId: string) {
        const user = await this.findByID(userId, ['role', 'company']);
        if (!user) throw new NotFoundException('User not found');

        return this.toJSON(user, UserProfileDto);
    }

    async updateMyProfile(userId: string, body: UpdateProfileDto) {
        const user = await this.userRepo.update(userId, body);
        if (!user) throw new NotFoundException('User not found');

        return this.toJSON(user, UserProfileDto);
    }

    public async updateFirebaseNotificationToken(userID: string, { token, deviceType }: UpdateFirebaseNotificationDto) {
        // could have replaced platform in string literal
        // with notification token to fix the bug too
        const doc = await this.userRepo.updateRaw(
            { _id: userID },
            { $addToSet: { [`firebaseSetting.notificationTokens.${deviceType}`]: token } },
        );
        if (!doc) throw new UserNotFoundException();

        return this.toJSON(doc, UserProfileDto);
    }

    public async deleteFirebaseNotificationToken(uId: string, notificationToken: string) {
        await this.userRepo.updateRaw(
            { _id: uId },
            {
                $pull: {
                    'firebaseSetting.notificationTokens.android': notificationToken,
                    'firebaseSetting.notificationTokens.ios': notificationToken,
                    'firebaseSetting.notificationTokens.web': notificationToken,
                    'firebaseSetting.notificationTokens.other': notificationToken,
                },
            },
        );
    }

    public static async generateSalt() {
        return await bcrypt.genSalt(10);
    }

    public async getHashedPassword(password: string) {
        const salt = await UserService.generateSalt();
        return await bcrypt.hash(password, salt);
    }

    public static generateToken(length = 6, type: 'simple' | 'full' | 'extended' = 'simple') {
        let letters = '';

        switch (type) {
            case 'full':
                letters += 'abcdefghijklmnopqrstuvwxyz';
                break;
            case 'extended':
                letters += `_^$@abcdefghijklmnopqrstuvwxyz${'abcdefghijklmnopqrstuvwxyz'.toUpperCase()}`;
                break;
            case 'simple':
                letters += '0123456789';
        }

        let OTP = '';

        for (let i = 0; i < length; i++) {
            OTP += letters[Math.floor(Math.random() * letters.length)];
        }

        return OTP;
    }

    async findUsersForSuperAdmin(companyId: string, query: PaginationQueryDto): Promise<PaginatedUserForAdminDto> {
        const docs = await this.userRepo.paginatedFindAllUsersByCompanyForSuperAdmin(companyId, query);
        const docsCount = await this.userRepo.findAllUsersByCompanyCountForPaginationSuperAdmin(companyId, query);

        return {
            items: this.toJSONs(docs, UserForAdminDto),
            pagination: {
                total: docsCount,
                current: query.page,
                previous: query.page === 1 ? 1 : query.page - 1,
                next: docsCount > query.page * query.pageSize ? query.page + 1 : query.page,
            },
        };
    }

    async manageUserActivation(id: string, userId: string, query: UserActivationQuery): Promise<UserForAdminDto> {
        const doc = await this.userRepo.manageUserActivation(id, userId, query);
        if (!doc) throw new NotFoundException('User not found');

        return this.toJSON(doc, UserForAdminDto);
    }

    async manageUserFromSuperAdmin(id: string, query: UserActivationQuery): Promise<UserForAdminDto> {
        const doc = await this.userRepo.manageUserFromSuperAdmin(id, query);
        if (!doc) throw new NotFoundException('User not found');

        return this.toJSON(doc, UserForAdminDto);
    }

    async deleteUserFromSuperAdmin(id: string): Promise<UserForAdminDto> {
        const doc = await this.userRepo.deleteUserFromSuperAdmin(id);
        if (!doc) throw new NotFoundException('User not found');

        return this.toJSON(doc, UserForAdminDto);
    }
}
