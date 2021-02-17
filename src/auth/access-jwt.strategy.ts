import { jwtConstants } from './constants';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access') {
    constructor(
        private usersService: UserService,
    ) {
        super({
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: Record<string, any>): Promise<Record<string, any>> {
        if (payload.type !== 'access') {
            throw new UnauthorizedException();
        }
        const legalEntity = await this.usersService.findOne(payload.sub);

        return { userId: payload.sub, legalEntityId: legalEntity ? legalEntity.legalEntityId : null, role: payload.role };
    }
}
