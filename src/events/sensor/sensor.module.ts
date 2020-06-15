import { Module, OnModuleInit } from '@nestjs/common';
import { EventBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { EventStoreModule } from '../../event-store/event-store.module';
import { EventStorePublisher } from '../../event-store/event-store.publisher';

import { SensorActivatedHandler } from './sensor-activated.handler';
import { SensorDeactivatedHandler } from './sensor-deactivated.handler';

@Module({
  controllers: [],
  imports: [CqrsModule, EventStoreModule],
  providers: [
    EventBus,
    EventStorePublisher,
    EventPublisher,
    SensorActivatedHandler,
    SensorDeactivatedHandler,
  ],
})

export class SensorEventModule implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStorePublisher,
  ) {}
  onModuleInit() {
    this.eventBus.publisher = this.eventStore;
  }
}
