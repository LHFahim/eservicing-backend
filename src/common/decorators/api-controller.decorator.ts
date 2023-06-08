import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { Serialize } from '@app/utils';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { APIVersions, ControllersEnum } from '../enums';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';

export const ApiController = (path: ControllersEnum, apiTag = '', version: APIVersions = APIVersions.V1) =>
    applyDecorators(
        Serialize(),
        ApiBearerAuth(),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiTags(apiTag),
        Controller({ path, version }),
    );
