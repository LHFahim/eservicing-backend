import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { RoleSeedData } from './data/roles-seed';
import { RoleDto } from './dto/role.dto';
import { RoleEntity } from './entities/role.entity';
import { SerializeService } from '@app/utils/serializer/serialize.service';

@Injectable()
export class RoleService extends SerializeService<RoleEntity> {
    private logger = new Logger(RoleService.name);

    constructor(@InjectModel(RoleEntity) private readonly roleModel: ReturnModelType<typeof RoleEntity>) {
        super(RoleEntity);
    }

    async onModuleInit() {
        await this.seedDefaultRoles();
    }

    async getRoles() {
        const roles = await this.roleModel.find();

        return this.toJSONs(roles, RoleDto);
    }

    async seedDefaultRoles() {
        await Promise.allSettled(
            RoleSeedData.map(({ id, ...role }) => {
                return this.roleModel.findOneAndUpdate({ _id: id }, { _id: id, ...role }, { upsert: true, new: true });
            }),
        );

        this.logger.log('Roles Seed Done!');
        return true;
    }
}
