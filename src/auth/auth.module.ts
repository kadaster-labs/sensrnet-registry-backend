// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { OidcStrategy, buildOpenIdClient } from './oidc.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AccessJwtStrategy } from './access-jwt.strategy';
import { AnonymousStrategy } from './anonymous.strategy';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

const OidcStrategyFactory = {
    provide: 'OidcStrategy',
    useFactory: async (authService: AuthService) => {
      const client = await buildOpenIdClient(); // secret sauce! build the dynamic client before injecting it into the strategy for use in the constructor super call.
      const strategy = new OidcStrategy(authService, client);

      return strategy;
    },
    inject: [AuthService]
};

@Module({
    imports: [
        UserModule,
        CqrsModule,
        PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
        JwtModule.register({
            secret: jwtConstants.secret,
        }),
    ], controllers: [
        AuthController,
    ], providers: [
        // LocalStrategy,
        // AccessJwtStrategy,
        // RefreshJwtStrategy,
        // AnonymousStrategy,
        OidcStrategyFactory,
        SessionSerializer,
        AuthService,
    ], exports: [
        AuthService,
        // AccessJwtStrategy,
    ],
})

export class AuthModule {}
