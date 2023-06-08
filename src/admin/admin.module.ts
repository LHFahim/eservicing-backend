import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module';
import { AdminUserModule } from './user/admin-user.module';

@Module({
    imports: [
        AdminAuthModule,
        AdminUserModule,
    ],
})
export class AdminModule {}
