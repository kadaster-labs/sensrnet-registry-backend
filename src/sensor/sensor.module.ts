import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { OnModuleInit, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { SensorSagas } from './sagas/sensors.sagas';
import { SensorsController } from './controllers/sensors.controller';
import { SensorsService } from './services/sensors.service';
import { SensorRepository } from './repository/sensor.repository';
import { EventStoreModule } from '../core/event-store/event-store.module';
import { EventStore } from '../core/event-store/event-store';
import { SensorRegisteredEvent } from './events/impl/sensor-registered.event';
import { SensorDeletedEvent } from './events/impl/sensor-deleted.event';
import { SensorUpdatedEvent } from './events/impl/sensor-updated.event';

@Module({
  imports: [
    CQRSModule,
    EventStoreModule.forFeature(),
  ],
  controllers: [SensorsController],
  providers: [
    SensorsService,
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
    SensorRegisteredEvent: (data) => new SensorRegisteredEvent(data),
    SensorDeletedEvent: (data) => new SensorDeletedEvent(data),
    SensorUpdatedEvent: (data) => new SensorUpdatedEvent(data),
  };
}
