import { Module } from '@nestjs/common';
import { UserSchema } from '../user/user.model';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema } from './data/sensor.model';
import { UserService } from '../user/user.service';
import { SensorGateway } from './gateway/sensor.gateway';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SensorProcessor } from './processor/sensor.processor';
import { SensorEsListener } from './processor/sensor.es.listener';
import { SensorController } from './controller/sensor.controller';
import { EventStoreModule } from '../event-store/event-store.module';
import { OrganizationGateway } from './gateway/organization.gateway';
import { RetrieveSensorQueryHandler } from './handler/sensor.handler';
import { SensorESController } from './controller/sensor.es.controller';
import { RetrieveSensorsQueryHandler } from './handler/sensors.handler';
import { CheckpointModule } from './service/checkpoint/checkpoint.module';
import { OrganizationSchema } from './controller/model/organization.model';
import { OrganizationProcessor } from './processor/organization.processor';
import { OrganizationController } from './controller/organization.controller';
import { OrganizationEsController } from './controller/organization.es.controller';
import { OrganizationEsListener } from './processor/organization-es-listener';
import { RetrieveOrganizationQueryHandler } from './handler/retrieve-organization.handler';
import { RetrieveOrganizationsQueryHandler } from './handler/retrieve-organizations.handler';
import { OrganizationsController } from './controller/organizations.controller';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        CheckpointModule,
        EventStoreModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MongooseModule.forFeature([{name: 'Sensor', schema: SensorSchema}]),
        MongooseModule.forFeature([{name: 'Organization', schema: OrganizationSchema}]),
    ], controllers: [
        SensorController,
        SensorESController,
        OrganizationController,
        OrganizationsController,
        OrganizationEsController,
    ], providers: [
        UserService,
        SensorGateway,
        EventPublisher,
        SensorProcessor,
        SensorEsListener,
        OrganizationGateway,
        OrganizationProcessor,
        OrganizationEsListener,
        RetrieveSensorQueryHandler,
        RetrieveSensorsQueryHandler,
        RetrieveOrganizationQueryHandler,
        RetrieveOrganizationsQueryHandler,
    ],
})

export class QueryModule {}
