// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UserModule,
        CqrsModule,
    ], controllers: [
        AuthController,
    ], providers: [
        JwtStrategy,
        AuthService,
    ], exports: [
        JwtStrategy,
        AuthService,
    ],
})

export class AuthModule {}
