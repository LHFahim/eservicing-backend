import { DocumentCTWithTimeStamps, Model } from '@app/utils';
import { Prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { APIVersions, ControllersEnum, Permissions } from '../../common';

@Model('permissions', true)
export class PermissionEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @Prop({ required: true })
    apiPath: string;

    @Expose()
    @Prop({ required: true, enum: APIVersions, default: APIVersions.V1 })
    apiVersion: APIVersions;

    @Expose()
    @Prop({ required: true, enum: ControllersEnum })
    controller: ControllersEnum;

    @Expose()
    @Prop({ required: true, enum: Permissions })
    permission: Permissions;

    @Expose()
    @Prop({ required: false, type: Boolean, default: true })
    isActive?: boolean;

    @Expose()
    @Prop({ required: false, type: Boolean, default: false })
    isDeleted?: boolean;
}
