import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { EventStoreModule } from '../event-store/event-store.module';
import { UserPermissionsSchema, UserSchema } from '../user/model/user.model';
import { UserService } from '../user/user.service';
import { DeviceController } from './controller/device-controller';
import { DeviceEsController } from './controller/device.es.controller';
import { RetrieveDeviceQueryHandler } from './controller/handler/device.handler';
import { RetrieveDevicesQueryHandler } from './controller/handler/devices.handler';
import { LegalEntitiesQueryHandler } from './controller/handler/legal-entities.handler';
import { LegalEntityQueryHandler } from './controller/handler/legal-entity.handler';
import { LegalEntitiesController } from './controller/legal-entities.controller';
import { LegalEntityController } from './controller/legal-entity.controller';
import { LegalEntityEsController } from './controller/legal-entity.es.controller';
import { ObservationGoalEsController } from './controller/observation-goal.es.controller';
import { Gateway } from './gateway/gateway';
import { DeviceSchema } from './model/device.model';
import { LegalEntitySchema } from './model/legal-entity.model';
import { ObservationGoalSchema } from './model/observation-goal.model';
import { RelationSchema } from './model/relation.model';
import { DeviceEsListener } from './processor/device.es.listener';
import { DeviceProcessor } from './processor/device.processor';
import { LegalEntityEsListener } from './processor/legal-entity.es.listener';
import { LegalEntityProcessor } from './processor/legal-entity.processor';
import { ObservationGoalEsListener } from './processor/observationgoal.es.listener';
import { ObservationGoalProcessor } from './processor/observationgoal.processor';
import { CheckpointModule } from './service/checkpoint/checkpoint.module';

@Module({
    imports: [
        JwtModule.register({}),
        CqrsModule,
        AuthModule,
        CheckpointModule,
        EventStoreModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MongooseModule.forFeature([{name: 'Device', schema: DeviceSchema}]),
        MongooseModule.forFeature([{name: 'Relation', schema: RelationSchema}]),
        MongooseModule.forFeature([{name: 'LegalEntity', schema: LegalEntitySchema}]),
        MongooseModule.forFeature([{name: 'ObservationGoal', schema: ObservationGoalSchema}]),
        MongooseModule.forFeature([{name: 'UserPermissions', schema: UserPermissionsSchema}]),
    ], controllers: [
        DeviceController,
        DeviceEsController,
        LegalEntityController,
        LegalEntitiesController,
        LegalEntityEsController,
        ObservationGoalEsController,
    ], providers: [
        Gateway,
        UserService,
        EventPublisher,
        DeviceProcessor,
        DeviceEsListener,
        LegalEntityProcessor,
        LegalEntityEsListener,
        ObservationGoalProcessor,
        ObservationGoalEsListener,
        RetrieveDeviceQueryHandler,
        RetrieveDevicesQueryHandler,
        LegalEntityQueryHandler,
        LegalEntitiesQueryHandler,
    ],
})

export class QueryModule { }
