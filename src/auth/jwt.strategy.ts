import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserQueryService } from '../commons/user/user.qry-service';
import { IUserPermissions } from '../commons/user/user.schema';
import { AuthService } from './auth.service';
import { ValidatedUser } from './validated-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    protected logger: Logger = new Logger(this.constructor.name);

    constructor(private authService: AuthService, private userQryService: UserQueryService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: process.env.OIDC_JWKS_URL,
                handleSigningKeyError: (err, cb) => {
                    this.logger.warn(`Could not verify token signature: ${JSON.stringify(err.name)}`);
                    return cb(err);
                },
            }),
            issuer: process.env.OIDC_ISSUER,
            audience: process.env.OIDC_AUDIENCE,
            algorithms: ['RS256'],
        });
    }

    async validate(idToken: Record<string, any>): Promise<ValidatedUser> {
        const userId: string = await this.authService.createOrLogin(idToken);
        const user: ValidatedUser = { userId };

        const permission: IUserPermissions = await this.userQryService.retrieveUserPermissions(userId);
        if (permission && permission.legalEntityId) {
            user.legalEntityId = permission.legalEntityId;
            user.role = permission.role;
        }

        this.logger.verbose(`validated user: [${JSON.stringify(user)}]`);
        return user;
    }
}
