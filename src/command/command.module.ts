import { UserSchema } from '../user/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, OnModuleInit } from '@nestjs/common';
import { SensorController } from './controller/sensor.controller';
import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { EventStoreModule } from '../event-store/event-store.module';
import { SensorRepository } from '../core/repositories/sensor.repository';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { CreateSensorCommandHandler } from './handler/create-sensor.handler';
import { UpdateSensorCommandHandler } from './handler/update-sensor.handler';
import { DeleteSensorCommandHandler } from './handler/delete-sensor.handler';
import { OrganizationController } from './controller/organization.controller';
import { ActivateSensorCommandHandler } from './handler/activate-sensor.handler';
import { UpdateDataStreamCommandHandler } from './handler/update-datastream.handler';
import { DeactivateSensorCommandHandler } from './handler/deactivate-sensor.handler';
import { CreateDatastreamCommandHandler } from './handler/create-datastream.handler';
import { DeleteDataStreamCommandHandler } from './handler/delete-datastream.handler';
import { UpdateOrganizationCommandHandler } from './handler/update-organization.handler';
import { DeleteOrganizationCommandHandler } from './handler/delete-organization.handler';
import { RegisterOrganizationCommandHandler } from './handler/register-organization.handler';
import { OrganizationRepository } from '../core/repositories/organization-repository.service';
import { UpdateSensorLocationCommandHandler } from './handler/update-sensor-location.handler';
import { ShareSensorOwnershipCommandHandler } from './handler/share-sensor-ownership.handler';
import { TransferSensorOwnershipCommandHandler } from './handler/transfer-sensor-ownership.handler';

@Module({
    controllers: [
        OrganizationController,
        SensorController,
    ], imports: [
        CqrsModule,
        EventStoreModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ], providers: [
        EventBus,
        EventPublisher,
        OrganizationRepository,
        SensorRepository,
        EventStorePublisher,
        // owner
        UpdateOrganizationCommandHandler,
        DeleteOrganizationCommandHandler,
        RegisterOrganizationCommandHandler,
        // sensor
        CreateSensorCommandHandler,
        UpdateSensorCommandHandler,
        DeleteSensorCommandHandler,
        ActivateSensorCommandHandler,
        DeactivateSensorCommandHandler,
        CreateDatastreamCommandHandler,
        DeleteDataStreamCommandHandler,
        UpdateDataStreamCommandHandler,
        UpdateSensorLocationCommandHandler,
        ShareSensorOwnershipCommandHandler,
        TransferSensorOwnershipCommandHandler,
    ], exports: [
        OrganizationRepository,
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
