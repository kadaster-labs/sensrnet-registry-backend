import { UserSchema } from '../user/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, OnModuleInit } from '@nestjs/common';
import { SensorController } from './controller/sensor.controller';
import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { EventStoreModule } from '../event-store/event-store.module';
import { SensorRepository } from '../core/repositories/sensor.repository';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { RegisterSensorCommandHandler } from './handler/model/sensor/register-sensor.handler';
import { UpdateSensorCommandHandler } from './handler/model/sensor/update-sensor.handler';
import { DeleteSensorCommandHandler } from './handler/model/sensor/delete-sensor.handler';
import { LegalEntityController } from './controller/legal-entity.controller';
import { UpdateDataStreamCommandHandler } from './handler/model/data-stream/update-datastream.handler';
import { CreateDataStreamCommandHandler } from './handler/model/data-stream/register-datastream.handler';
import { DeleteDataStreamCommandHandler } from './handler/model/data-stream/delete-datastream.handler';
import { UpdateLegalEntityCommandHandler } from './handler/model/legal-entity/update-legal-entity.handler';
import { DeleteLegalEntityCommandHandler } from './handler/model/legal-entity/delete-legal-entity.handler';
import { RegisterLegalEntityCommandHandler } from './handler/model/legal-entity/register-legal-entity.handler';
import { LegalEntityRepository } from '../core/repositories/legal-entity.repository';
import { RegisterDeviceCommandHandler } from './handler/model/device/register-device.handler';
import { UpdateDeviceCommandHandler } from './handler/model/device/update-device.handler';
import { DeleteDeviceCommandHandler } from './handler/model/device/delete-device.handler';
import { DeviceRepository } from '../core/repositories/device.repository';
import { DeviceController } from './controller/device.controller';
import { DataStreamRepository } from '../core/repositories/data-stream.repository';
import { DataStreamController } from './controller/data-stream.controller';

@Module({
    controllers: [
        LegalEntityController,
        SensorController,
        DeviceController,
        DataStreamController,
    ], imports: [
        CqrsModule,
        EventStoreModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ], providers: [
        EventBus,
        EventPublisher,
        LegalEntityRepository,
        SensorRepository,
        DeviceRepository,
        DataStreamRepository,
        EventStorePublisher,
        UpdateDeviceCommandHandler,
        DeleteDeviceCommandHandler,
        RegisterDeviceCommandHandler,
        RegisterLegalEntityCommandHandler,
        UpdateLegalEntityCommandHandler,
        DeleteLegalEntityCommandHandler,
        RegisterSensorCommandHandler,
        UpdateSensorCommandHandler,
        DeleteSensorCommandHandler,
        CreateDataStreamCommandHandler,
        DeleteDataStreamCommandHandler,
        UpdateDataStreamCommandHandler,
    ], exports: [
        LegalEntityRepository,
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
