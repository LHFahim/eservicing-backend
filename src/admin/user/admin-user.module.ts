import { Module } from '@nestjs/common';
import { SuperAdminUserController } from './admin-user.controller';

@Module({
    imports: [],
    controllers: [SuperAdminUserController],
})
export class AdminUserModule {}
