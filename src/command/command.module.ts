import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceRepository } from '../core/repositories/device.repository';
import { LegalEntityRepository } from '../core/repositories/legal-entity.repository';
import { ObservationGoalRepository } from '../core/repositories/observation-goal.repository';
import { EventStoreModule } from '../event-store/event-store.module';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { UserSchema } from '../user/model/user.model';
import { DataStreamController } from './controller/data-stream.controller';
import { DeviceController } from './controller/device.controller';
import { LegalEntityController } from './controller/legal-entity.controller';
import { ObservationGoalController } from './controller/observation-goal.controller';
import { SensorController } from './controller/sensor.controller';
import { AddDataStreamCommandHandler } from './handler/model/data-stream/add-datastream.handler';
import { LinkObservationGoalCommandHandler } from './handler/model/data-stream/link-observationgoal.handler';
import { RemoveDataStreamCommandHandler } from './handler/model/data-stream/remove-datastream.handler';
import { UnlinkObservationGoalCommandHandler } from './handler/model/data-stream/unlink-observationgoal.handler';
import { UpdateDataStreamCommandHandler } from './handler/model/data-stream/update-datastream.handler';
import { RegisterDeviceCommandHandler } from './handler/model/device/register-device.handler';
import { RelocateDeviceCommandHandler } from './handler/model/device/relocate-device.handler';
import { RemoveDeviceCommandHandler } from './handler/model/device/remove-device.handler';
import { UpdateDeviceCommandHandler } from './handler/model/device/update-device.handler';
import { AddPublicContactDetailsCommandHandler } from './handler/model/legal-entity/add-contact-details.handler';
import { RemoveLegalEntityCommandHandler } from './handler/model/legal-entity/delete-legal-entity.handler';
import { RegisterOrganizationCommandHandler } from './handler/model/legal-entity/register-organization.handler';
import { RemoveContactDetailsCommandHandler } from './handler/model/legal-entity/remove-contact-details.handler';
import { UpdateContactDetailsCommandHandler } from './handler/model/legal-entity/update-contact-details.handler';
import { UpdateLegalEntityCommandHandler } from './handler/model/legal-entity/update-legal-entity.handler';
import { RegisterObservationGoalCommandHandler } from './handler/model/observation-goal/add-observation-goal.handler';
import { RemoveObservationGoalCommandHandler } from './handler/model/observation-goal/remove-observation-goal.handler';
import { UpdateObservationGoalCommandHandler } from './handler/model/observation-goal/update-observation-goal.handler';
import { AddSensorCommandHandler } from './handler/model/sensor/add-sensor.handler';
import { RemoveSensorCommandHandler } from './handler/model/sensor/remove-sensor.handler';
import { UpdateSensorCommandHandler } from './handler/model/sensor/update-sensor.handler';

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
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ], providers: [
        EventBus,
        EventPublisher,
        LegalEntityRepository,
        DeviceRepository,
        ObservationGoalRepository,
        EventStorePublisher,
        // legal-entity
        RegisterOrganizationCommandHandler,
        UpdateLegalEntityCommandHandler,
        RemoveLegalEntityCommandHandler,
        AddPublicContactDetailsCommandHandler,
        UpdateContactDetailsCommandHandler,
        RemoveContactDetailsCommandHandler,
        // sensor-device
        RegisterDeviceCommandHandler,
        UpdateDeviceCommandHandler,
        RelocateDeviceCommandHandler,
        RemoveDeviceCommandHandler,
        // sensor
        AddSensorCommandHandler,
        UpdateSensorCommandHandler,
        RemoveSensorCommandHandler,
        // datastream
        AddDataStreamCommandHandler,
        RemoveDataStreamCommandHandler,
        UpdateDataStreamCommandHandler,
        LinkObservationGoalCommandHandler,
        UnlinkObservationGoalCommandHandler,
        // observation-goal
        RegisterObservationGoalCommandHandler,
        UpdateObservationGoalCommandHandler,
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
