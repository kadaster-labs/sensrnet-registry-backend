import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UserModule,
        CqrsModule,
    ], providers: [
        JwtStrategy,
        AuthService,
    ], exports: [
        JwtStrategy,
        AuthService,
    ],
})

export class AuthModule {}
