import { OwnerController } from "./owner.controller";
import { Module, OnModuleInit } from "@nestjs/common";
import { CreateCommandHandler } from "./commands/create.handler";
import { UpdateCommandHandler } from "./commands/update.handler";
import { OwnerRepository } from "./repositories/owner.repository";
import { WithdrawCommandHandler } from "./commands/delete.handler";
import { EventBus, CqrsModule, EventPublisher } from "@nestjs/cqrs";
import { EventStoreModule } from "../event-store/event-store.module";
import { EventStorePublisher } from "../event-store/event-store.publisher";


@Module({
  controllers: [OwnerController],
  imports: [CqrsModule, EventStoreModule, OwnerModule],
  providers: [
    EventBus,
    EventStorePublisher,
    EventPublisher,
    OwnerRepository,
    CreateCommandHandler,
    UpdateCommandHandler,
    WithdrawCommandHandler
  ]
})

export class OwnerModule implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStorePublisher
  ) {}
  onModuleInit() {
    this.eventBus.publisher = this.eventStore;
  }
}
