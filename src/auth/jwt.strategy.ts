import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.OIDC_JWKS_URL,
      }),
      issuer: process.env.OIDC_ISSUER_URL,
      audience: process.env.OIDC_AUDIENCE,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: Record<string, any>): Promise<Record<string, any>> {
    Logger.log('User authenticated');
    const userId: string = await this.authService.createOrLogin(payload);

    return { userId };
  }
}