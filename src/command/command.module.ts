import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/model/user.model';
import { Module, OnModuleInit } from '@nestjs/common';
import { DeviceController } from './controller/device.controller';
import { SensorController } from './controller/sensor.controller';
import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { EventStoreModule } from '../event-store/event-store.module';
import { DeviceRepository } from '../core/repositories/device.repository';
import { DataStreamController } from './controller/data-stream.controller';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { LegalEntityController } from './controller/legal-entity.controller';
import { AddSensorCommandHandler } from './handler/model/sensor/add-sensor.handler';
import { LegalEntityRepository } from '../core/repositories/legal-entity.repository';
import { UpdateSensorCommandHandler } from './handler/model/sensor/update-sensor.handler';
import { RemoveSensorCommandHandler } from './handler/model/sensor/remove-sensor.handler';
import { UpdateDeviceCommandHandler } from './handler/model/device/update-device.handler';
import { RemoveDeviceCommandHandler } from './handler/model/device/remove-device.handler';
import { RegisterDeviceCommandHandler } from './handler/model/device/register-device.handler';
import { AddDataStreamCommandHandler } from './handler/model/data-stream/add-datastream.handler';
import { UpdateDataStreamCommandHandler } from './handler/model/data-stream/update-datastream.handler';
import { RemoveDataStreamCommandHandler } from './handler/model/data-stream/remove-datastream.handler';
import { UpdateLegalEntityCommandHandler } from './handler/model/legal-entity/update-legal-entity.handler';
import { DeleteLegalEntityCommandHandler } from './handler/model/legal-entity/delete-legal-entity.handler';
import { RegisterLegalEntityCommandHandler } from './handler/model/legal-entity/register-legal-entity.handler';
import { RegisterObservationGoalCommandHandler } from './handler/model/observation-goal/add-observation-goal.handler';
import { UpdateObservationGoalCommandHandler } from './handler/model/observation-goal/update-observation-goal.handler';
import { RemoveObservationGoalCommandHandler } from './handler/model/observation-goal/remove-observation-goal.handler';
import { ObservationGoalController } from './controller/observation-goal.controller';
import { LinkObservationGoalCommandHandler } from './handler/model/data-stream/link-observationgoal.handler';
import { UnlinkObservationGoalCommandHandler } from './handler/model/data-stream/unlink-observationgoal.handler';
import { ObservationGoalRepository } from '../core/repositories/observation-goal.repository';

@Module({
    controllers: [
        SensorController,
        DeviceController,
        DataStreamController,
        LegalEntityController,
        ObservationGoalController,
    ], imports: [
        CqrsModule,
        EventStoreModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ], providers: [
        EventBus,
        EventPublisher,
        LegalEntityRepository,
        DeviceRepository,
        ObservationGoalRepository,
        EventStorePublisher,
        UpdateDeviceCommandHandler,
        RemoveDeviceCommandHandler,
        RegisterDeviceCommandHandler,
        RegisterLegalEntityCommandHandler,
        UpdateLegalEntityCommandHandler,
        DeleteLegalEntityCommandHandler,
        AddSensorCommandHandler,
        UpdateSensorCommandHandler,
        RemoveSensorCommandHandler,
        AddDataStreamCommandHandler,
        RemoveDataStreamCommandHandler,
        UpdateDataStreamCommandHandler,
        RegisterObservationGoalCommandHandler,
        UpdateObservationGoalCommandHandler,
        LinkObservationGoalCommandHandler,
        UnlinkObservationGoalCommandHandler,
        RemoveObservationGoalCommandHandler,
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
