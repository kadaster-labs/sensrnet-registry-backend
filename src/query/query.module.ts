import { Module } from '@nestjs/common';
import { UserSchema } from '../user/user.model';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema } from './data/sensor.model';
import { UserService } from '../user/user.service';
import { OwnerGateway } from './gateway/owner.gateway';
import { SensorGateway } from './gateway/sensor.gateway';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { OwnerSchema } from './controller/model/owner.model';
import { OwnerProcessor } from './processor/owner.processor';
import { SensorProcessor } from './processor/sensor.processor';
import { OwnerController } from './controller/owner.controller';
import { OwnerEsListener } from './processor/owner.es.listener';
import { SensorEsListener } from './processor/sensor.es.listener';
import { SensorController } from './controller/sensor.controller';
import { OwnerEsController } from './controller/owner.es.controller';
import { EventStoreModule } from '../event-store/event-store.module';
import { RetrieveSensorQueryHandler } from './handler/sensor.handler';
import { SensorESController } from './controller/sensor.es.controller';
import { RetrieveSensorsQueryHandler } from './handler/sensors.handler';
import { CheckpointModule } from './service/checkpoint/checkpoint.module';
import { RetrieveOwnerQueryHandler } from './handler/retrieve-owner.handler';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        CheckpointModule,
        EventStoreModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MongooseModule.forFeature([{name: 'Owner', schema: OwnerSchema}]),
        MongooseModule.forFeature([{name: 'Sensor', schema: SensorSchema}]),
    ],
    controllers: [
        OwnerController,
        SensorController,
        OwnerEsController,
        SensorESController,
    ],
    providers: [
        UserService,
        OwnerGateway,
        SensorGateway,
        EventPublisher,
        OwnerProcessor,
        OwnerEsListener,
        SensorProcessor,
        SensorEsListener,
        RetrieveOwnerQueryHandler,
        RetrieveSensorQueryHandler,
        RetrieveSensorsQueryHandler,
    ],
})

export class QueryModule {}
