import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserSchema } from '../../users/models/user.model';
import { DeleteUserCommandHandler } from './commands/delete.handler';
import { EventStoreModule } from '../../event-store/event-store.module';
import { RegisterUserCommandHandler } from './commands/register.handler';

@Module({
  controllers: [
    UserController,
  ],
  imports: [
    CqrsModule,
    EventStoreModule,
    UserCommandModule,
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
  ],
  providers: [
    DeleteUserCommandHandler,
    RegisterUserCommandHandler,
  ],
})

export class UserCommandModule {}
