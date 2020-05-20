import { ModuleRef } from '@nestjs/core';
import { OwnerSagas } from './sagas/owner.sagas';
import { EventHandlers } from './events/handlers';
import { OnModuleInit, Module } from '@nestjs/common';
import { CommandHandlers } from './commands/handlers';
import { EventStore } from '../eventstore/event-store';
import { OwnerService } from './services/owner.service';
import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { OwnerRepository } from './repository/owner.repository';
import { OwnerController } from './controllers/owner.controller';
import { EventStoreModule } from '../eventstore/event-store.module';
import { OwnerRemovedEvent } from './events/impl/owner-removed.event';
import { OwnerUpdatedEvent } from './events/impl/owner-updated.event';
import { OwnerRegisteredEvent } from './events/impl/owner-registered.event';


@Module({
  imports: [
    CQRSModule,
    EventStoreModule.forFeature(),
  ],
  controllers: [OwnerController],
  providers: [
    OwnerService,
    OwnerSagas,
    ...CommandHandlers,
    ...EventHandlers,
    OwnerRepository,
  ],
})

export class OwnerModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly ownerSagas: OwnerSagas,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);
    /** ------------ */
    this.eventStore.setEventHandlers(this.eventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
    /** ------------ */
    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);
    this.event$.combineSagas([this.ownerSagas.ownerCreated]);
  }

  eventHandlers = {
    OwnerRemovedEvent: (data) => new OwnerRemovedEvent(data),
    OwnerUpdatedEvent: (data) => new OwnerUpdatedEvent(data),
    OwnerRegisteredEvent: (data) => new OwnerRegisteredEvent(data)    
  };
}
