import { Serialize } from '@app/utils';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { APIVersions, ControllersEnum } from '../common';
import { RoleService } from './role.service';

@ApiTags('Role')
@ApiBearerAuth()
@Serialize()
@Controller({ path: ControllersEnum.Roles, version: APIVersions.V1 })
export class RoleController {
    constructor(private readonly rolesService: RoleService) {}
}
