import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AccessJwtStrategy } from './access-jwt.strategy';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, RefreshJwtStrategy, AccessJwtStrategy],
  exports: [AuthService],
})

export class AuthModule {}
