import { Module } from '@nestjs/common';
import { UserSchema } from '../user/model/user.model';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema } from './model/sensor.model';
import { UserService } from '../user/user.service';
import { DeviceSchema } from './model/device.model';
import { RelationSchema } from './model/relation.model';
import { DeviceGateway } from './gateway/device.gateway';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { LegalEntitySchema } from './model/legal-entity.model';
import { DataStreamSchema } from './model/datastream.model';
import { DeviceController } from './controller/device-controller';
import { EventStoreModule } from '../event-store/event-store.module';
import { LegalEntityGateway } from './gateway/legal-entity.gateway';
import { RetrieveDeviceQueryHandler } from './controller/handler/device.handler';
import { DeviceEsController } from './controller/device.es.controller';
import { RetrieveDevicesQueryHandler } from './controller/handler/devices.handler';
import { CheckpointModule } from './service/checkpoint/checkpoint.module';
import { LegalEntityProcessor } from './processor/legal-entity.processor';
import { LegalEntityController } from './controller/legal-entity.controller';
import { LegalEntityEsController } from './controller/legal-entity.es.controller';
import { LegalEntityEsListener } from './processor/legal-entity-es-listener.service';
import { LegalEntityQueryHandler } from './controller/handler/legal-entity.handler';
import { LegalEntitiesQueryHandler } from './controller/handler/legal-entities.handler';
import { LegalEntitiesController } from './controller/legal-entities.controller';
import { DeviceProcessor } from './processor/device.processor';
import { DeviceEsListener } from './processor/device.es.listener';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        CheckpointModule,
        EventStoreModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MongooseModule.forFeature([{name: 'Sensor', schema: SensorSchema}]),
        MongooseModule.forFeature([{name: 'Device', schema: DeviceSchema}]),
        MongooseModule.forFeature([{name: 'Relation', schema: RelationSchema}]),
        MongooseModule.forFeature([{name: 'DataStream', schema: DataStreamSchema}]),
        MongooseModule.forFeature([{name: 'LegalEntity', schema: LegalEntitySchema}]),
    ], controllers: [
        DeviceController,
        DeviceEsController,
        LegalEntityController,
        LegalEntitiesController,
        LegalEntityEsController,
    ], providers: [
        UserService,
        EventPublisher,
        DeviceProcessor,
        DeviceEsListener,
        DeviceGateway,
        LegalEntityGateway,
        LegalEntityProcessor,
        LegalEntityEsListener,
        RetrieveDeviceQueryHandler,
        RetrieveDevicesQueryHandler,
        LegalEntityQueryHandler,
        LegalEntitiesQueryHandler,
    ],
})

export class QueryModule {}
