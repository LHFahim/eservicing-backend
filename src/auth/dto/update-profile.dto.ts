import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

export class UpdateProfileDto extends PickType(UserEntity, ['firstName', 'lastName']) {}
