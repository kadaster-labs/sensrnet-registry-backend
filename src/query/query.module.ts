import { Module } from '@nestjs/common';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { EventProcessingModule } from '../commons/event-processing/event-processing.module';
import { EventStoreModule } from '../commons/event-store/event-store.module';
import { UserModule } from '../commons/user/user.module';
import { UserQueryService } from '../commons/user/user.qry-service';
import { UserPermissionsSchema, UserSchema } from '../commons/user/user.schema';
import { DeviceController } from './api/device-controller';
import { DeviceEsController } from './api/device.es.controller';
import { LegalEntitiesController } from './api/legal-entities.controller';
import { LegalEntityController } from './api/legal-entity.controller';
import { LegalEntityEsController } from './api/legal-entity.es.controller';
import { ObservationGoalController } from './api/observation-goal.controller';
import { ObservationGoalEsController } from './api/observation-goal.es.controller';
import { UserController } from './api/user.controller';
import { Gateway } from './gateway/gateway';
import { RetrieveDeviceQueryHandler } from './handler/device.handler';
import { RetrieveDevicesQueryHandler } from './handler/devices.handler';
import { LegalEntitiesQueryHandler } from './handler/legal-entities.handler';
import { LegalEntityQueryHandler } from './handler/legal-entity.handler';
import { ObservationGoalQueryHandler } from './handler/observation-goal.handler';
import { ObservationGoalsQueryHandler } from './handler/observation-goals.handler';
import { RetrieveUserQueryHandler } from './handler/retrieve-users.handler';
import { ObservationGoalEsListener } from './listeners/observationgoal.es.listener';
import { QueryDeviceEsListener } from './listeners/query-device-es-listener.service';
import { QueryLegalEntityEsListener } from './listeners/query-legal-entity-es-listener.service';
import { DeviceSchema } from './model/device.schema';
import { LegalEntitySchema } from './model/legal-entity.schema';
import { ObservationGoalSchema } from './model/observation-goal.schema';
import { RelationSchema } from './model/relation.schema';
import { DeviceProcessor } from './processor/device.processor';
import { LegalEntityProcessor } from './processor/legal-entity.processor';
import { ObservationGoalProcessor } from './processor/observationgoal.processor';

@Module({
    imports: [
        JwtModule.register({}),
        CqrsModule,
        AuthModule,
        UserModule,
        EventProcessingModule,
        EventStoreModule,
        MongooseModule.forFeature([{ name: 'Device', schema: DeviceSchema }]),
        MongooseModule.forFeature([{ name: 'Relation', schema: RelationSchema }]),
        MongooseModule.forFeature([{ name: 'LegalEntity', schema: LegalEntitySchema }]),
        MongooseModule.forFeature([{ name: 'ObservationGoal', schema: ObservationGoalSchema }]),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'UserPermissions', schema: UserPermissionsSchema }]),
    ],
    controllers: [
        DeviceController,
        DeviceEsController,
        LegalEntityController,
        LegalEntitiesController,
        LegalEntityEsController,
        ObservationGoalController,
        ObservationGoalEsController,
        UserController,
    ],
    providers: [
        Gateway,
        UserQueryService,
        EventPublisher,
        DeviceProcessor,
        QueryDeviceEsListener,
        LegalEntityProcessor,
        QueryLegalEntityEsListener,
        ObservationGoalProcessor,
        ObservationGoalEsListener,
        RetrieveDeviceQueryHandler,
        RetrieveDevicesQueryHandler,
        ObservationGoalQueryHandler,
        ObservationGoalsQueryHandler,
        LegalEntityQueryHandler,
        LegalEntitiesQueryHandler,
        RetrieveUserQueryHandler,
    ],
})
export class QueryModule {}
