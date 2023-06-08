import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { ConfigService } from '../../config/config.service';
import { UserService } from '../../user/user.service';
import { AuthUserDto } from '../dto/auth-user.dto';
import { isDocument } from '@typegoose/typegoose';
import { Roles } from '../../common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private config: ConfigService, private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.jwt.secret,
        } as StrategyOptions);
    }

    async validate(payload: any): Promise<AuthUserDto> {
        const user = await this.userService.findByID(payload.id, ['role']);
        if (!user) throw new UnauthorizedException('Unauthorized');
        if (!isDocument(user.role)) throw new UnauthorizedException('Unauthorized');

        if (user.role.name === Roles.USER) {
            if (!user.isActive) throw new HttpException('Account Inactive', 423);
            if (user.isDeleted) throw new HttpException('Account Deleted', 410);
        } else {
            if (user.isDeleted || !user.isActive) throw new UnauthorizedException('Unauthorized');
        }

        user.lastActive = new Date();
        await user.save();

        return {
            id: user._id.toString(),
            email: user.email,
            roleName: user.role.name,
        };
    }
}
