import { connect } from 'mongoose';
import { SensorController } from "./sensor.controller";
import { Module, OnModuleInit } from "@nestjs/common";
import { CqrsModule, EventPublisher } from "@nestjs/cqrs";
import { EventStoreModule } from "../../event-store/event-store.module";
import { EventStorePublisher } from "../../event-store/event-store.publisher";
import { RetrieveSensorQueryHandler } from "./queries/sensor.handler";
import { RetrieveSensorsQueryHandler } from "./queries/sensors.handler";
import { SensorProcessor } from './processors';
import { SensorGateway } from './sensor.gateway';


@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    SensorQueryModule
  ],
  controllers: [SensorController],
  providers: [
    EventPublisher,
    RetrieveSensorQueryHandler,
    RetrieveSensorsQueryHandler,
    SensorProcessor,
    SensorGateway,
  ]
})

export class SensorQueryModule implements OnModuleInit {
  constructor(
    private readonly eventStore: EventStorePublisher,
    private readonly sensorProcessor: SensorProcessor,
    private readonly sensorGateway: SensorGateway,
  ) { }
  onModuleInit() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const database = process.env.MONGO_DATABASE || 'sensrnet';

    const url = 'mongodb://' + host + ':' + port.toString() + '/' + database;
    connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    const onEvent = (_, event) => {
      this.sensorProcessor.process(event);
      this.sensorGateway.emit(event.eventType, event);
    };

    this.eventStore.subscribeToStream('$ce-sensor', onEvent, () => { });
  }
}
