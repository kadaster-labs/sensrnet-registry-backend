import { UserController } from './user.controller';
import { Module, OnModuleInit } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { EventBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { DeleteUserCommandHandler } from './commands/delete.handler';
import { EventStoreModule } from '../../event-store/event-store.module';
import { RegisterUserCommandHandler } from './commands/register.handler';
import { EventStorePublisher } from '../../event-store/event-store.publisher';

@Module({
  controllers: [UserController],
  imports: [CqrsModule, EventStoreModule, UserCommandModule],
  providers: [
    EventBus,
    EventPublisher,
    UserRepository,
    EventStorePublisher,
    DeleteUserCommandHandler,
    RegisterUserCommandHandler,
  ],
})

export class UserCommandModule implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStorePublisher,
  ) {}
  onModuleInit() {
    this.eventBus.publisher = this.eventStore;
  }
}
