import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from '../command/command.module';
import { UserController } from './controller/user.controller';
import { DeleteUserCommandHandler } from './handler/delete-user.handler';
import { JoinLegalEntityCommandHandler } from './handler/join-legal-entity.handler';
import { LeaveLegalEntityCommandHandler } from './handler/leave-legal-entity.handler';
import { RegisterOidcUserCommandHandler } from './handler/register-oidc-user.handler';
import { RetrieveUserQueryHandler } from './handler/retrieve-users.handler';
import { UpdateUserRoleCommandHandler } from './handler/update-user-role.handler';
import { UserPermissionsSchema, UserSchema } from './model/user.model';
import { UserService } from './user.service';

@Module({
    imports: [
        CqrsModule,
        CommandModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'UserPermissions', schema: UserPermissionsSchema }]),
    ], controllers: [
        UserController,
    ], providers: [
        UserService,
        // user
        RetrieveUserQueryHandler,
        DeleteUserCommandHandler,
        JoinLegalEntityCommandHandler,
        LeaveLegalEntityCommandHandler,
        UpdateUserRoleCommandHandler,
        RegisterOidcUserCommandHandler,
    ], exports: [
        UserService,
    ],
})

export class UserModule { }
