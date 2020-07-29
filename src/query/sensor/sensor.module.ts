import { Module } from '@nestjs/common';
import { SensorProcessor } from './processors';
import { SensorGateway } from './sensor.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema } from './models/sensor.model';
import { SensorController } from './sensor.controller';
import { SensorEsListener } from './sensor.es.listener';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SensorESController } from './sensor.es.controller';
import { CheckpointModule } from '../checkpoint/checkpoint.module';
import { RetrieveSensorQueryHandler } from './queries/sensor.handler';
import { RetrieveSensorsQueryHandler } from './queries/sensors.handler';
import { EventStoreModule } from '../../event-store/event-store.module';

@Module({
  imports: [
    CqrsModule,
    CheckpointModule,
    EventStoreModule,
    SensorQueryModule,
    MongooseModule.forFeature([{name: 'Sensor', schema: SensorSchema}]),
  ],
  controllers: [
    SensorController,
    SensorESController,
  ],
  providers: [
    SensorGateway,
    EventPublisher,
    SensorProcessor,
    SensorEsListener,
    RetrieveSensorQueryHandler,
    RetrieveSensorsQueryHandler,
  ],
})

export class SensorQueryModule {}
