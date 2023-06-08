import { DocumentCTWithTimeStamps, Model } from '@app/utils';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { Roles } from '../../common';
import { PermissionEntity } from '../../permission/entities/permission.entity';

@Model('roles', true)
export class RoleEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @Prop({ required: true, enum: Roles })
    name: Roles;

    @Expose()
    @Prop({ required: false, trim: true, maxlength: 100, default: '' })
    displayName?: string;

    @Expose()
    @Prop({ required: false, trim: true, default: '' })
    description?: string;

    @Expose()
    @Prop({ required: true, ref: () => PermissionEntity })
    permissions: Ref<PermissionEntity>[];

    @Expose()
    @Prop({ required: false, type: Boolean, default: true })
    isActive?: boolean;
}
