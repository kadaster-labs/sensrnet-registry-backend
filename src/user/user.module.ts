import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserSchema} from './user.model';
import {MongooseModule} from '@nestjs/mongoose';
import {UserController} from './user.controller';
import {DeleteUserCommandHandler} from './delete-user.handler';
import {RegisterUserCommandHandler} from './register-user.handler';
import {CqrsModule} from '@nestjs/cqrs';

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        // user
        DeleteUserCommandHandler,
        RegisterUserCommandHandler,
    ],
    exports: [UserService],
})

export class UserModule {
}
