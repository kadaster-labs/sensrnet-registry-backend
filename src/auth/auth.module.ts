import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AnonymousStrategy } from './strategy/anonymous.strategy';
import { AccessJwtStrategy } from './strategy/access-jwt.strategy';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';
import { AuthController } from './controller/auth.controller';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
        }),
    ], controllers: [
        AuthController,
    ], providers: [
        AuthService,
        LocalStrategy,
        AccessJwtStrategy,
        RefreshJwtStrategy,
        AnonymousStrategy,
    ], exports: [
        AuthService,
        AccessJwtStrategy,
    ],
})

export class AuthModule {}
