import { Module } from '@nestjs/common';
import { SuperAdminAuthController } from './admin-auth.controller';

@Module({
    imports: [],
    controllers: [SuperAdminAuthController],
})
export class AdminAuthModule {}
