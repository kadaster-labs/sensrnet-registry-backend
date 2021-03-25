import { jwtConstants } from '../constants';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

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
        const permissions = await this.usersService.findUserPermissions({_id: payload.sub});

        return {
            userId: payload.sub,
            role: permissions ? permissions.role : null,
            legalEntityId: permissions ? permissions.legalEntityId : null,
        };
    }
}
