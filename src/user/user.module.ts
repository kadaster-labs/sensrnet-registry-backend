import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserSchema } from './user.model';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { CommandModule } from '../command/command.module';
import { UpdateUserCommandHandler } from './handler/update-user.handler';
import { DeleteUserCommandHandler } from './handler/delete-user.handler';
import { RegisterUserCommandHandler } from './handler/register-user.handler';
import { RegisterOidcUserCommandHandler } from './handler/register-oidc-user.handler';

@Module({
    imports: [
        CqrsModule,
        CommandModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ], controllers: [
        UserController,
    ], providers: [
        UserService,
        // user
        DeleteUserCommandHandler,
        UpdateUserCommandHandler,
        RegisterUserCommandHandler,
        RegisterOidcUserCommandHandler,
    ], exports: [
        UserService,
    ],
})

export class UserModule {}
