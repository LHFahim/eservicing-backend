import { Types } from 'mongoose';
import { APIVersions, ControllersEnum, Permissions } from '../../common';

export interface PermissionSeed {
    id: Types.ObjectId;
    apiPath: string;
    apiVersion: APIVersions;
    controller: ControllersEnum;
    permission: Permissions;
}
