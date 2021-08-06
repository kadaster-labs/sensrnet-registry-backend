import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../commons/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [UserModule, CqrsModule],
    providers: [JwtStrategy, AuthService],
    exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
