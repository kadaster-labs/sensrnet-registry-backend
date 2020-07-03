import { OwnerController } from './sensor.controller';
import { Module, OnModuleInit } from '@nestjs/common';
import { SensorRepository } from './repositories/sensor.repository';
import { EventBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { CreateSensorCommandHandler } from './commands/create.handler';
import { UpdateSensorCommandHandler } from './commands/update.handler';
import { DeleteSensorCommandHandler } from './commands/delete.handler';
import { EventStoreModule } from '../../event-store/event-store.module';
import { OwnerRepository } from '../owner/repositories/owner.repository';
import { ActivateSensorCommandHandler } from './commands/activate.handler';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { DeactivateSensorCommandHandler } from './commands/deactivate.handler';
import { CreateDataStreamCommandHandler } from './commands/createdatastream.handler';
import { DeleteDataStreamCommandHandler } from './commands/deletedatastream.handler';
import { UpdateSensorLocationCommandHandler } from './commands/updatelocation.handler';
import { ShareSensorOwnershipCommandHandler } from './commands/shareownership.handler';
import { TransferSensorOwnershipCommandHandler } from './commands/transferownership.handler';

@Module({
  controllers: [OwnerController],
  imports: [CqrsModule, EventStoreModule, SensorCommandModule],
  providers: [
    EventBus,
    EventPublisher,
    OwnerRepository,
    SensorRepository,
    EventStorePublisher,
    CreateSensorCommandHandler,
    UpdateSensorCommandHandler,
    DeleteSensorCommandHandler,
    ActivateSensorCommandHandler,
    DeactivateSensorCommandHandler,
    CreateDataStreamCommandHandler,
    DeleteDataStreamCommandHandler,
    UpdateSensorLocationCommandHandler,
    ShareSensorOwnershipCommandHandler,
    TransferSensorOwnershipCommandHandler,
  ],
})

export class SensorCommandModule implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStorePublisher,
  ) {}
  onModuleInit() {
    this.eventBus.publisher = this.eventStore;
  }
}
