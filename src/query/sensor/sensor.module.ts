import { connect } from 'mongoose';
import { SensorProcessor } from './processors';
import { SensorGateway } from './sensor.gateway';
import { plainToClass } from 'class-transformer';
import { sensorEventType } from '../../events/sensor';
import { SensorController } from './sensor.controller';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { NODE_ID } from '../../events/sensor/sensor.event';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { CheckpointModule } from '../checkpoint/checkpoint.module';
import { CheckpointService } from '../checkpoint/checkpoint.service';
import { RetrieveSensorQueryHandler } from './queries/sensor.handler';
import { RetrieveSensorsQueryHandler } from './queries/sensors.handler';
import { EventStoreModule } from '../../event-store/event-store.module';
import { EventStorePublisher } from '../../event-store/event-store.publisher';

@Module({
  imports: [
    CqrsModule,
    CheckpointModule,
    EventStoreModule,
    SensorQueryModule,
  ],
  controllers: [
      SensorController,
  ],
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
      private readonly checkpointService: CheckpointService,
  ) {}

  subscribeToStreamWithReconnect(streamName, checkpointId, onEvent) {
    const timeoutMs = process.env.EVENT_STORE_TIMEOUT ? Number(process.env.EVENT_STORE_TIMEOUT) : 10000;

    const timeout = setTimeout(() => {
      this.logger.error(`Failed to connect to EventStore. Exiting.`);
      process.exit(0);
    }, timeoutMs);

    const onDropped = () => {
      this.logger.warn(`Event stream dropped. Retrying in ${timeoutMs}ms.`);
      setTimeout(() => this.subscribeToStreamWithReconnect(streamName, checkpointId, onEvent), timeoutMs);
    };

    this.checkpointService.findOne({_id: checkpointId}).then((data) => {
      const offset = data ? data.offset : 0;
      this.logger.log(`Subscribing to stream ${streamName} from offset ${offset}.`);
      this.eventStore.subscribeToStreamFrom(streamName, offset, onEvent, null, onDropped)
          .then(() => clearTimeout(timeout), () => this.logger.error(`Failed to subscribe to stream ${streamName}.`));
    }, () => this.logger.error(`Failed to determine offset of stream ${streamName}.`));
  }

  onModuleInit() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const database = process.env.MONGO_DATABASE || 'sensrnet';

    const url = `mongodb://${host}:${port}/${database}`;
    connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then();

    const onEvent = (_, eventMessage) => {
      const offset = eventMessage.positionEventNumber;
      const callback = () => this.checkpointService.updateOne({_id: 'sensor'}, {offset});

      if (eventMessage.metadata && eventMessage.metadata.originSync) {
        if (!eventMessage.data || eventMessage.data.nodeId === NODE_ID) {
          this.logger.debug('Not implemented: Handle sync event of current node.');
          callback().then();
        } else {
          const event = plainToClass(sensorEventType.getType(eventMessage.eventType), eventMessage.data);
          this.sensorProcessor.process(event).then(callback, callback);
        }
      } else {
        const event = plainToClass(sensorEventType.getType(eventMessage.eventType), eventMessage.data);
        this.sensorProcessor.process(event).then(callback, callback);
      }
    };

    this.subscribeToStreamWithReconnect('$ce-sensor', 'sensor', onEvent);
  }
}
