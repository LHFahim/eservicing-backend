import { Types } from 'mongoose';
import { Roles } from '../../common';

export interface RoleSeed {
    id: Types.ObjectId;
    name: Roles;
    displayName?: string;
    description?: string;
    permissions: Types.ObjectId[];
}
