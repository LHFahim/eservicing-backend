import { Reflector } from '@nestjs/core';
import { applyDecorators, CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Permissions } from '../../common';

const View = () => SetMetadata('permission', Permissions.View);
const Add = () => SetMetadata('permission', Permissions.Add);
const Update = () => SetMetadata('permission', Permissions.Update);
const Delete = () => SetMetadata('permission', Permissions.Delete);

// const Invite = () => SetMetadata('permission', Permissions.Invite);

export const AuthorizeView = () => applyDecorators(View(), UseGuards(PermissionGuard));
export const AuthorizeAdd = () => applyDecorators(Add(), UseGuards(PermissionGuard));
export const AuthorizeUpdate = () => applyDecorators(Update(), UseGuards(PermissionGuard));
export const AuthorizeDelete = () => applyDecorators(Delete(), UseGuards(PermissionGuard));

// export const AuthorizeInvite = () => applyDecorators(Invite(), UseGuards(JwtAuthGuard, RoleGuard));

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        return true;
    }
}
