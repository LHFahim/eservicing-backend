import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from '../../common';

@Injectable()
export class SuperAdminRoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const path = request.path;

        if (!path.includes('/super-admin/')) return false;

        return request.user.roleName === Roles.SUPER_ADMIN || request.user.roleName === Roles.MANAGER;
    }
}

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const path = request.path;

        if (path.includes('/admin/') || path.includes('/super-admin/')) return false;
        if (path.includes('/auth/')) return true;

        if (request.user.roleName === Roles.USER) {
            if (!request.user.companyId)
                throw new BadRequestException(
                    'You are not assigned with any company. Please use the join code to complete your profile',
                );

            return true;
        }

        return false;
    }
}
