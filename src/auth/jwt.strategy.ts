import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthService } from './auth.service';
import { IUserPermissions } from '../user/model/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.OIDC_JWKS_URL,
        handleSigningKeyError: (err, cb) => {
          Logger.warn(`Could not verify token signature: ${JSON.stringify(err.name)}`);
          return cb(err);
        }
      }),
      issuer: process.env.OIDC_ISSUER,
      audience: process.env.OIDC_AUDIENCE,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: Record<string, any>): Promise<Record<string, any>> {
    const user = {};

    const userId: string = await this.authService.createOrLogin(payload);
    user['userId'] = userId;

    const permission: IUserPermissions = await this.userService.findUserPermissions({ _id: userId });
    if (permission && permission.legalEntityId) {
      user['legalEntityId'] = permission.legalEntityId;
    }

    return user;
  }
}
