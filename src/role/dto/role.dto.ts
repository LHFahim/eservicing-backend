import { PickType } from '@nestjs/swagger';
import { RoleEntity } from '../entities/role.entity';

export class RoleDto extends PickType(RoleEntity, ['_id', 'name', 'displayName', 'description']) {}
