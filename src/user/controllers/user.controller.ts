import { ApiController, ControllersEnum } from '../../common';
import { UserService } from '../user.service';

@ApiController(ControllersEnum.Users, 'Users API')
export class UserController {
    constructor(private usersService: UserService) {}
}
