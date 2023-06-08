import { Global, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { RoleEntity } from './entities/role.entity';

@Global()
@Module({
    imports: [TypegooseModule.forFeature([RoleEntity])],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
