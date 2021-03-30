import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserPermissionsSchema, UserSchema } from './model/user.model';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { CommandModule } from '../command/command.module';
import { UpdateUserCommandHandler } from './handler/update-user.handler';
import { DeleteUserCommandHandler } from './handler/delete-user.handler';
import { RetrieveUserQueryHandler } from './handler/retrieve-users.handler';
import { UpdateUserRoleCommandHandler } from './handler/update-user-role.handler';
import { RegisterOidcUserCommandHandler } from './handler/register-oidc-user.handler';

@Module({
    imports: [
        CqrsModule,
        CommandModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MongooseModule.forFeature([{name: 'UserPermissions', schema: UserPermissionsSchema}]),
    ], controllers: [
        UserController,
    ], providers: [
        UserService,
        // user
        RetrieveUserQueryHandler,
        DeleteUserCommandHandler,
        UpdateUserCommandHandler,
        UpdateUserRoleCommandHandler,
        RegisterOidcUserCommandHandler,
    ], exports: [
        UserService,
    ],
})

export class UserModule { }
