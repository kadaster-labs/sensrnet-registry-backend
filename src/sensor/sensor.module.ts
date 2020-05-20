import { ModuleRef } from '@nestjs/core';
import { EventHandlers } from './events/handlers';
import { SensorSagas } from './sagas/sensor.sagas';
import { CommandHandlers } from './commands/handlers';
import { OnModuleInit, Module } from '@nestjs/common';
import { EventStore } from '../eventstore/event-store';
import { SensorService } from './services/sensor.service';
import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { SensorRepository } from './repository/sensor.repository';
import { SensorController } from './controllers/sensor.controller';
import { EventStoreModule } from '../eventstore/event-store.module';
import { SensorRemovedEvent } from './events/impl/sensor-removed.event';
import { SensorRegisteredEvent } from './events/impl/sensor-registered.event';
import { SensorDetailsUpdatedEvent, SensorOwnershipTransferredEvent, 
  SensorOwnershipSharedEvent, SensorActivatedEvent,
  SensorDeactivatedEvent, DataStreamAddedEvent, 
  DataStreamRemovedEvent, SensorLocationUpdatedEvent } from './events/impl/sensor-updated.event';


@Module({
  imports: [
    CQRSModule,
    EventStoreModule.forFeature(),
  ],
  controllers: [SensorController],
  providers: [
    SensorService,
    SensorSagas,
    ...CommandHandlers,
    ...EventHandlers,
    SensorRepository,
  ],
})

export class SensorModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly sensorSagas: SensorSagas,
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
    this.event$.combineSagas([this.sensorSagas.sensorCreated]);
  }

  eventHandlers = {
    SensorRemovedEvent: (data) => new SensorRemovedEvent(data),
    SensorActivatedEvent: (data) => new SensorActivatedEvent(data),
    SensorRegisteredEvent: (data) => new SensorRegisteredEvent(data),
    SensorDeactivatedEvent: (data) => new SensorDeactivatedEvent(data),
    SensorDataStreamAddedEvent: (data) => new DataStreamAddedEvent(data),
    SensorDataStreamRemovedEvent: (data) => new DataStreamRemovedEvent(data),
    SensorDetailsUpdatedEvent: (data) => new SensorDetailsUpdatedEvent(data),
    SensorOwnershipSharedEvent: (data) => new SensorOwnershipSharedEvent(data),
    SensorLocationUpdatedEvent: (data) => new SensorLocationUpdatedEvent(data),
    SensorOwnershipTransferredEvent: (data) => new SensorOwnershipTransferredEvent(data),
  };
}
