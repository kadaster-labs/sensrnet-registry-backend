import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { EventProcessingModule } from '../commons/event-processing/event-processing.module';
import { EventStoreModule } from '../commons/event-store/event-store.module';
import { EventStorePublisher } from '../commons/event-store/event-store.publisher';
import { UserModule } from '../commons/user/user.module';
import { UserPermissionsSchema, UserSchema } from '../commons/user/user.schema';
import { RelationSchema } from '../query/model/relation.schema';
import { DatastreamController } from './api/data-stream.controller';
import { DeviceController } from './api/device.controller';
import { LegalEntityController } from './api/legal-entity.controller';
import { ObservationGoalController } from './api/observation-goal.controller';
import { SensorController } from './api/sensor.controller';
import { UserController } from './api/user.controller';
import { AddDatastreamCommandHandler } from './handler/model/data-stream/add-datastream.handler';
import { LinkObservationGoalCommandHandler } from './handler/model/data-stream/link-observationgoal.handler';
import { RemoveDatastreamCommandHandler } from './handler/model/data-stream/remove-datastream.handler';
import { UnlinkObservationGoalCommandHandler } from './handler/model/data-stream/unlink-observationgoal.handler';
import { UpdateDatastreamCommandHandler } from './handler/model/data-stream/update-datastream.handler';
import { RegisterDeviceCommandHandler } from './handler/model/device/register-device.handler';
import { RelocateDeviceCommandHandler } from './handler/model/device/relocate-device.handler';
import { RemoveDeviceCommandHandler } from './handler/model/device/remove-device.handler';
import { UpdateDeviceCommandHandler } from './handler/model/device/update-device.handler';
import { AddPublicContactDetailsCommandHandler } from './handler/model/legal-entity/add-contact-details.handler';
import { RemoveLegalEntityCommandHandler } from './handler/model/legal-entity/delete-legal-entity.handler';
import { JoinLegalEntityCommandHandler } from './handler/model/legal-entity/join-legal-entity.handler';
import { LeaveLegalEntityCommandHandler } from './handler/model/legal-entity/leave-legal-entity.handler';
import { RegisterOrganizationCommandHandler } from './handler/model/legal-entity/register-organization.handler';
import { RemoveContactDetailsCommandHandler } from './handler/model/legal-entity/remove-contact-details.handler';
import { UpdateContactDetailsCommandHandler } from './handler/model/legal-entity/update-contact-details.handler';
import { UpdateLegalEntityCommandHandler } from './handler/model/legal-entity/update-legal-entity.handler';
import { UpdateUserRoleCommandHandler } from './handler/model/legal-entity/update-user-role.handler';
import { RegisterObservationGoalCommandHandler } from './handler/model/observation-goal/add-observation-goal.handler';
import { RemoveObservationGoalCommandHandler } from './handler/model/observation-goal/remove-observation-goal.handler';
import { UpdateObservationGoalCommandHandler } from './handler/model/observation-goal/update-observation-goal.handler';
import { AddSensorCommandHandler } from './handler/model/sensor/add-sensor.handler';
import { RemoveSensorCommandHandler } from './handler/model/sensor/remove-sensor.handler';
import { UpdateSensorCommandHandler } from './handler/model/sensor/update-sensor.handler';
import { DeleteUserCommandHandler } from './handler/model/user/delete-user.handler';
import { RegisterOidcUserCommandHandler } from './handler/model/user/register-oidc-user.handler';
import { LegalEntityEsListener } from './processors/legal-entity.es.listener';
import { LegalEntityProcessor } from './processors/legal-entity.processor';
import { DeviceRepository } from './repositories/device.repository';
import { LegalEntityRepository } from './repositories/legal-entity.repository';
import { ObservationGoalRepository } from './repositories/observation-goal.repository';
import { UserService } from './repositories/user.service';

@Module({
    controllers: [
        SensorController,
        DeviceController,
        DatastreamController,
        LegalEntityController,
        ObservationGoalController,
        UserController,
    ],
    imports: [
        CqrsModule,
        EventStoreModule,
        EventProcessingModule,
        UserModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Relation', schema: RelationSchema }]),
        MongooseModule.forFeature([{ name: 'UserPermissions', schema: UserPermissionsSchema }]),
    ],
    providers: [
        EventBus,
        EventPublisher,
        LegalEntityRepository,
        DeviceRepository,
        ObservationGoalRepository,
        UserService,
        EventStorePublisher,
        // legal-entity
        RegisterOrganizationCommandHandler,
        UpdateLegalEntityCommandHandler,
        RemoveLegalEntityCommandHandler,
        AddPublicContactDetailsCommandHandler,
        UpdateContactDetailsCommandHandler,
        RemoveContactDetailsCommandHandler,
        LegalEntityProcessor,
        LegalEntityEsListener,
        // sensor-device
        RegisterDeviceCommandHandler,
        UpdateDeviceCommandHandler,
        RelocateDeviceCommandHandler,
        RemoveDeviceCommandHandler,
        // sensor
        AddSensorCommandHandler,
        UpdateSensorCommandHandler,
        RemoveSensorCommandHandler,
        // data-stream
        AddDatastreamCommandHandler,
        RemoveDatastreamCommandHandler,
        UpdateDatastreamCommandHandler,
        LinkObservationGoalCommandHandler,
        UnlinkObservationGoalCommandHandler,
        // observation-goal
        RegisterObservationGoalCommandHandler,
        UpdateObservationGoalCommandHandler,
        RemoveObservationGoalCommandHandler,
        // user
        RegisterOidcUserCommandHandler,
        JoinLegalEntityCommandHandler,
        LeaveLegalEntityCommandHandler,
        UpdateUserRoleCommandHandler,
        DeleteUserCommandHandler,
    ],
    exports: [LegalEntityRepository],
})
export class CommandModule implements OnModuleInit {
    constructor(private readonly eventBus: EventBus, private readonly eventStore: EventStorePublisher) {}

    onModuleInit(): void {
        this.eventBus.publisher = this.eventStore;
    }
}
