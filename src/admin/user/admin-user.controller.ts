import { Delete, Get, Patch, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto, Routes } from '../../common';
import { ResourceId } from '../../common/decorators/params.decorator';
import { UserService } from '../../user/user.service';
import { UserActivationQuery } from './dto/admin-user.dto';

@Routes.superAdmin.users.controller
export class SuperAdminUserController {
    constructor(private readonly userService: UserService) {}

    // @Routes.superAdmin.users.routes.findUsersForSuperAdmin
    @Get(Routes.superAdmin.users.findUsersForSuperAdmin.path)
    @ApiOperation({ summary: Routes.superAdmin.users.findUsersForSuperAdmin.summary })
    async findUsersForSuperAdmin(@ResourceId('companyId') companyId: string, @Query() query: PaginationQueryDto) {
        return this.userService.findUsersForSuperAdmin(companyId, query);
    }

    @Delete(Routes.superAdmin.users.delete.path)
    @ApiOperation({ summary: Routes.superAdmin.users.delete.summary })
    async deleteUserFromSuperAdmin(@ResourceId() id: string) {
        return this.userService.deleteUserFromSuperAdmin(id);
    }

    @Patch(Routes.superAdmin.users.manage.path)
    @ApiOperation({ summary: Routes.superAdmin.users.manage.summary })
    async manageUserFromSuperAdmin(@ResourceId() id: string, @Query() query: UserActivationQuery) {
        return this.userService.manageUserFromSuperAdmin(id, query);
    }
}
