import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PermissionSeedData } from './data/permissions-seed';
import { PermissionEntity } from './entities/permission.entity';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { Permissions } from '../common';
import { RoleSeedData } from '../role/data/roles-seed';

@Injectable()
export class PermissionService {
    private logger = new Logger(PermissionService.name);
    constructor(
        @InjectModel(PermissionEntity) private readonly permissionModel: ReturnModelType<typeof PermissionEntity>,
    ) {}

    async onModuleInit() {
        await this.seedDefaultPermissions();
    }

    async seedDefaultPermissions() {
        await this.removeObsoleteDefaultPermissions();

        await Promise.allSettled(
            PermissionSeedData.map((permissionSeed) => {
                const { id, ...permission } = permissionSeed;
                return this.permissionModel.findOneAndUpdate(
                    { _id: id },
                    { _id: id, ...permission },
                    { upsert: true, new: true },
                );
            }),
        );

        this.logger.log('Permissions Seed Done!');
        return true;
    }

    async removeObsoleteDefaultPermissions() {
        const permissions = await this.permissionModel.find();

        for (const permission of permissions) {
            if (!PermissionSeedData.find((permissionSeed) => permissionSeed.id.equals(permission.id))) {
                await this.permissionModel.findByIdAndDelete(permission.id);
            }
        }
    }

    async hasPermission(user: AuthUserDto, permission: Permissions, path: string) {
        // not doing database query for faster lookup. could query & cache but that's for later
        const matchedPermission = PermissionSeedData.find(
            (permissionData) =>
                permissionData.permission === permission &&
                path.includes(`v${permissionData.apiVersion}/${permissionData.controller}/${permissionData.apiPath}`),
        );
        if (!matchedPermission) return false;

        return !!RoleSeedData.find(
            (role) =>
                role.name === user.roleName &&
                role.permissions.find((permissionId) => permissionId.equals(matchedPermission.id)),
        );
    }
}
