import { connect } from 'mongoose';
import { SensorProcessor } from './processors';
import { SensorGateway } from './sensor.gateway';
import { plainToClass } from 'class-transformer';
import { sensorEventType } from '../../events/sensor';
import { SensorController } from './sensor.controller';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { NODE_ID } from '../../events/sensor/sensor.event';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { RetrieveSensorQueryHandler } from './queries/sensor.handler';
import { RetrieveSensorsQueryHandler } from './queries/sensors.handler';
import { EventStoreModule } from '../../event-store/event-store.module';
import { EventStorePublisher } from '../../event-store/event-store.publisher';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    SensorQueryModule,
  ],
  controllers: [SensorController],
  providers: [
    SensorGateway,
    EventPublisher,
    SensorProcessor,
    RetrieveSensorQueryHandler,
    RetrieveSensorsQueryHandler,
  ],
})

export class SensorQueryModule implements OnModuleInit {
  protected logger: Logger = new Logger(this.constructor.name);

  constructor(
      private readonly eventStore: EventStorePublisher,
      private readonly sensorProcessor: SensorProcessor,
  ) {
  }
  onModuleInit() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const database = process.env.MONGO_DATABASE || 'sensrnet';

    const url = `mongodb://${host}:${port}/${database}`;
    connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then();

    const onEvent = (_, eventMessage) => {
      const event = plainToClass(sensorEventType.getType(eventMessage.eventType), eventMessage.data);
      this.sensorProcessor.process(event).then();
    };

    const onSyncEvent = (_, eventMessage) => {
      if (!eventMessage.data || eventMessage.data.nodeId === NODE_ID) {
        this.logger.debug('Not implemented: Handle sync event of current node.');
      } else {
        const event = plainToClass(sensorEventType.getType(eventMessage.eventType), eventMessage.data);
        this.sensorProcessor.process(event).then();
      }
    };

    this.eventStore.subscribeToStream('$ce-sensor', onEvent);
    this.eventStore.subscribeToStream('$ce-sensor_sync', onSyncEvent);
  }
}
