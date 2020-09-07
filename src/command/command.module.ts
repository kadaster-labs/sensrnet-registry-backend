import { UserSchema } from '../user/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, OnModuleInit } from '@nestjs/common';
import { OwnerController } from './controller/owner.controller';
import { SensorController } from './controller/sensor.controller';
import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { EventStoreModule } from '../event-store/event-store.module';
import { OwnerRepository } from '../core/repositories/owner.repository';
import { SensorRepository } from '../core/repositories/sensor.repository';
import { UpdateOwnerCommandHandler } from './handler/update-owner.handler';
import { DeleteOwnerCommandHandler } from './handler/delete-owner.handler';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { CreateSensorCommandHandler } from './handler/create-sensor.handler';
import { UpdateSensorCommandHandler } from './handler/update-sensor.handler';
import { DeleteSensorCommandHandler } from './handler/delete-sensor.handler';
import { RegisterOwnerCommandHandler } from './handler/register-owner.handler';
import { ActivateSensorCommandHandler } from './handler/activate-sensor.handler';
import { DeactivateSensorCommandHandler } from './handler/deactivate-sensor.handler';
import { CreateDatastreamCommandHandler } from './handler/create-datastream.handler';
import { DeleteDataStreamCommandHandler } from './handler/delete-datastream.handler';
import { UpdateSensorLocationCommandHandler } from './handler/update-sensor-location.handler';
import { ShareSensorOwnershipCommandHandler } from './handler/share-sensor-ownership.handler';
import { TransferSensorOwnershipCommandHandler } from './handler/transfer-sensor-ownership.handler';

@Module({
    controllers: [
        OwnerController,
        SensorController,
    ],
    imports: [
        CqrsModule,
        EventStoreModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ],
    providers: [
        EventBus,
        EventPublisher,
        OwnerRepository,
        SensorRepository,
        EventStorePublisher,
        // owner
        UpdateOwnerCommandHandler,
        DeleteOwnerCommandHandler,
        RegisterOwnerCommandHandler,
        // sensor
        CreateSensorCommandHandler,
        UpdateSensorCommandHandler,
        DeleteSensorCommandHandler,
        ActivateSensorCommandHandler,
        DeactivateSensorCommandHandler,
        CreateDatastreamCommandHandler,
        DeleteDataStreamCommandHandler,
        UpdateSensorLocationCommandHandler,
        ShareSensorOwnershipCommandHandler,
        TransferSensorOwnershipCommandHandler,
    ],
    exports: [
        OwnerRepository,
    ],
})

export class CommandModule implements OnModuleInit {
    constructor(
        private readonly eventBus: EventBus,
        private readonly eventStore: EventStorePublisher,
    ) {}

    onModuleInit(): void {
        this.eventBus.publisher = this.eventStore;
    }
}
