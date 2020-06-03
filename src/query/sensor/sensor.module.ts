import {connect} from 'mongoose';
import {SensorController} from './sensor.controller';
import {Logger, Module, OnModuleInit} from '@nestjs/common';
import {CqrsModule, EventPublisher} from '@nestjs/cqrs';
import {EventStoreModule} from '../../event-store/event-store.module';
import {EventStorePublisher} from '../../event-store/event-store.publisher';
import {RetrieveSensorQueryHandler} from './queries/sensor.handler';
import {RetrieveSensorsQueryHandler} from './queries/sensors.handler';
import {SensorProcessor} from './processors';
import {plainToClass} from 'class-transformer';
import {sensorEventType} from '../../events/sensor';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    SensorQueryModule,
  ],
  controllers: [SensorController],
  providers: [
    EventPublisher,
    RetrieveSensorQueryHandler,
    RetrieveSensorsQueryHandler,
    SensorProcessor,
  ],
})

export class SensorQueryModule implements OnModuleInit {
  constructor(
      private readonly eventStore: EventStorePublisher,
      private readonly sensorProcessor: SensorProcessor,
  ) {
  }

  onModuleInit() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const database = process.env.MONGO_DATABASE || 'sensrnet';

    const url = 'mongodb://' + host + ':' + port.toString() + '/' + database;
    connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

    const onEvent = (_, eventMessage) => {
      const event = plainToClass(sensorEventType.getType(eventMessage.eventType), eventMessage.data);
      this.sensorProcessor.process(event);
    };

    this.eventStore.subscribeToStream('$ce-sensor', onEvent, () => {
      Logger.warn('Event stream dropped');
    });
  }
}
