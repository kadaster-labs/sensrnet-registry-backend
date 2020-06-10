import { OwnerController } from './owner.controller';
import { Module, OnModuleInit } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { OwnerRepository } from './repositories/owner.repository';
import { EventBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { EventStoreModule } from '../../event-store/event-store.module';
import { RegisterOwnerCommandHandler } from './commands/register-owner.handler';
import { RegisterUserCommandHandler } from './commands/register-user.handler';
import { UpdateOwnerCommandHandler } from './commands/update.handler';
import { DeleteOwnerCommandHandler } from './commands/delete.handler';
import { EventStorePublisher } from '../../event-store/event-store.publisher';

@Module({
  controllers: [OwnerController],
  imports: [CqrsModule, EventStoreModule, OwnerCommandModule],
  providers: [
    EventBus,
    EventStorePublisher,
    EventPublisher,
    OwnerRepository,
    UserRepository,
    RegisterOwnerCommandHandler,
    RegisterUserCommandHandler,
    UpdateOwnerCommandHandler,
    DeleteOwnerCommandHandler,
  ],
})

export class OwnerCommandModule implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStorePublisher,
  ) {}
  onModuleInit() {
    this.eventBus.publisher = this.eventStore;
  }
}
