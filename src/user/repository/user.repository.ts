import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserActivationQuery } from '../../admin/user/dto/admin-user.dto';
import { PaginationQueryDto } from '../../common';
import { UserEntity } from '../entities/user.entity';
import { getIdForSuperAdminRole } from '../../role/data/roles-seed';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>) {}

    async create(user: UserEntity): Promise<DocumentType<UserEntity>> {
        return this.userModel.create(user);
    }

    async findOne(query: FilterQuery<UserEntity>, populate: string[] = []): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOne(query).populate(populate);
    }

    async update(_id: string, user: Partial<UserEntity>): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOneAndUpdate(
            { _id },
            {
                $set: user,
            },
            { new: true },
        );
    }

    async updateRaw(query: FilterQuery<UserEntity>, data: UpdateQuery<UserEntity>, populate: string[] = []) {
        return this.userModel.findOneAndUpdate(query, data, { populate, new: true });
    }

    async save(user: DocumentType<UserEntity>): Promise<DocumentType<UserEntity>> {
        return await user.save();
    }

    // super admin
    paginatedFindAllUsersByCompanyForSuperAdmin(companyId: string, query: PaginationQueryDto) {
        return this.userModel
            .find({
                company: companyId,
                role: { $ne: getIdForSuperAdminRole() },
                isDeleted: false,
                ...(query.search && {
                    $or: [
                        { name: new RegExp(`.*${query.search}.*`, 'i') },
                        { email: new RegExp(`.*${query.search}.*`, 'i') },
                    ],
                }),
            })
            .sort({ [query.sortBy]: query.sort })
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize);
    }

    findAllUsersByCompanyCountForPaginationSuperAdmin(companyId: string, query: PaginationQueryDto) {
        return this.userModel.count({
            role: { $ne: getIdForSuperAdminRole() },
            isDeleted: false,
            ...(query.search && {
                $or: [
                    { name: new RegExp(`.*${query.search}.*`, 'i') },
                    { email: new RegExp(`.*${query.search}.*`, 'i') },
                ],
            }),
        });
    }

    async manageUserActivation(id: string, userId: string, query: UserActivationQuery) {
        return this.userModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isActive: query.isActive },
            { new: true },
        );
    }

    async manageUserFromSuperAdmin(id: string, query: UserActivationQuery) {
        return this.userModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isActive: query.isActive },
            { new: true },
        );
    }

    async deleteUserFromSuperAdmin(id: string) {
        return this.userModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
    }
}
