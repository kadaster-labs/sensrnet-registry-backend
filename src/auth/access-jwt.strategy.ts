import { jwtConstants } from './constants';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access') {
    constructor() {
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
        return { userId: payload.sub, organizationId: payload.organizationId, role: payload.role };
    }
}
