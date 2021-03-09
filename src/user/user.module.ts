import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { User, UserSchema } from './user.model';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { CommandModule } from '../command/command.module';
import { UpdateUserCommandHandler } from './handler/update-user.handler';
import { RegisterOidcUserCommandHandler } from './handler/register-oidc-user.handler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
    imports: [
        CqrsModule,
        CommandModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ], controllers: [
        UserController,
    ], providers: [
        UserService,
        // user
        UpdateUserCommandHandler,
        RegisterOidcUserCommandHandler,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ], exports: [
        UserService,
    ],
})

export class UserModule { }
