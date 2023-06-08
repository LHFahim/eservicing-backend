import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PermissionEntity } from './entities/permission.entity';

@Module({
    imports: [TypegooseModule.forFeature([PermissionEntity])],
    controllers: [PermissionController],
    providers: [PermissionService],
    exports: [PermissionService],
})
export class PermissionModule {}
