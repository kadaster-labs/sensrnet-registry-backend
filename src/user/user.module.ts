import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserSchema } from './model/user.model';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { CommandModule } from '../command/command.module';
import { UpdateUserCommandHandler } from './handler/update-user.handler';
import { DeleteUserCommandHandler } from './handler/delete-user.handler';
import { RegisterUserCommandHandler } from './handler/register-user.handler';

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
    ], exports: [
        UserService,
    ],
})

export class UserModule {}
