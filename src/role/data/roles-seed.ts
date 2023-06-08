import { Types } from 'mongoose';

import { Roles } from '../../common';
import { RoleSeed } from '../interfaces/role-seed.interface';

export const RoleSeedData: RoleSeed[] = [
    {
        id: new Types.ObjectId('62d55182bdfb546d79bb1000'),
        name: Roles.SUPER_ADMIN,
        displayName: 'Administrator',
        description: 'All rights to manage everything',
        // assigning all permissions
        permissions: [],
    },
    {
        id: new Types.ObjectId('62d55182bdfb546d79bb1001'),
        name: Roles.MANAGER,
        displayName: 'Manager',
        description: 'Manage admin resources',
        permissions: [],
    },

    {
        id: new Types.ObjectId('62d55182bdfb546d79bb1009'),
        name: Roles.USER,
        displayName: 'User',
        description: 'App User access',
        permissions: [],
    },
];

export const getIdForUserRole = () => RoleSeedData.find((role) => role.name === Roles.USER)?.id as Types.ObjectId;
export const getIdForManagerRole = () => RoleSeedData.find((role) => role.name === Roles.MANAGER)?.id as Types.ObjectId;
export const getIdForSuperAdminRole = () =>
    RoleSeedData.find((role) => role.name === Roles.SUPER_ADMIN)?.id as Types.ObjectId;
