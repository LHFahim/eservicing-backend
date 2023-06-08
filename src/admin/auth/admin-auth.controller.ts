import { Body, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Serialize } from '@app/utils';
import { AuthService } from '../../auth/auth.service';
import { LoginDto } from '../../auth/dto/auth-user.dto';
import { Routes } from '../../common';

@Serialize()
@Routes.superAdmin.auth.controller
export class SuperAdminAuthController {
    constructor(private readonly authService: AuthService) {}

    @Post(Routes.superAdmin.auth.login.path)
    @ApiOperation({ summary: Routes.superAdmin.auth.login.summary })
    async login(@Body() dto: LoginDto) {
        return this.authService.adminLogin(dto);
    }
}
