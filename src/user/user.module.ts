import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { User, UserSchema } from './user.model';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { CommandModule } from '../command/command.module';
import { UpdateUserCommandHandler } from './handler/update-user.handler';
import { RegisterOidcUserCommandHandler } from './handler/register-oidc-user.handler';

@Module({
    imports: [
        CqrsModule,
        CommandModule,
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ], controllers: [
        UserController,
    ], providers: [
        UserService,
        // user
        UpdateUserCommandHandler,
        RegisterOidcUserCommandHandler,
    ], exports: [
        UserService,
    ],
})

export class UserModule {}
