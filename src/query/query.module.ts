import {Module} from '@nestjs/common';
import {OwnerProcessor} from './processor/owner.processor';
import {OwnerGateway} from './gateway/owner.gateway';
import {MongooseModule} from '@nestjs/mongoose';
import {OwnerSchema} from './controller/model/owner.model';
import {OwnerController} from './controller/owner.controller';
import {OwnerEsListener} from './processor/owner.es.listener';
import {CqrsModule, EventPublisher} from '@nestjs/cqrs';
import {OwnerEsController} from './controller/owner.es.controller';
import {CheckpointModule} from './service/checkpoint/checkpoint.module';
import {RetrieveOwnerQueryHandler} from './handler/retrieve-owner.handler';
import {EventStoreModule} from '../event-store/event-store.module';
import {SensorGateway} from './gateway/sensor.gateway';
import {SensorEsListener} from './processor/sensor.es.listener';
import {RetrieveSensorQueryHandler} from './handler/sensor.handler';
import {RetrieveSensorsQueryHandler} from './handler/sensors.handler';
import {SensorProcessor} from './processor/sensor.processor';
import {SensorSchema} from './data/sensor.model';
import {SensorController} from './controller/sensor.controller';
import {SensorESController} from './controller/sensor.es.controller';
import {UserSchema} from '../user/user.model';
import {UserService} from '../user/user.service';

@Module({
    imports: [
        CqrsModule,
        CheckpointModule,
        EventStoreModule,
        MongooseModule.forFeature([{name: 'Owner', schema: OwnerSchema}]),
        MongooseModule.forFeature([{name: 'Sensor', schema: SensorSchema}]),
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ],
    controllers: [
        OwnerController,
        OwnerEsController,
        SensorController,
        SensorESController,
    ],
    providers: [
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
        UserService,
    ],
})

export class QueryModule {
}
