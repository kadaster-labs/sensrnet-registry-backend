import { Module, OnModuleInit } from '@nestjs/common';
import { EventBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { EventStoreModule } from '../../event-store/event-store.module';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { SensorSagas } from './sensor.sagas';
import { SensorSagasController } from './sensor.controller';

@Module({
  controllers: [SensorSagasController],
  imports: [CqrsModule, EventStoreModule],
  providers: [
    EventBus,
    EventStorePublisher,
    EventPublisher,
    SensorSagas,
  ],
})

export class SensorSagasModule implements OnModuleInit {
  constructor(
    private readonly events$: EventBus,
    private readonly eventStore: EventStorePublisher,
  ) {}
  onModuleInit() {
    this.events$.publisher = this.eventStore;
  }
}
