import { Global, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';
import { ProfileController } from './controllers/profile.controller';

@Global()
@Module({
    controllers: [UserController, ProfileController],
    providers: [UserService, UserRepository],
    imports: [TypegooseModule.forFeature([UserEntity])],
    exports: [UserService, UserRepository],
})
export class UserModule {}
