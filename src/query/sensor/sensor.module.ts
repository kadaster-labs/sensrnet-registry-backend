import { connect } from 'mongoose';
import { SensorController } from "./sensor.controller";
import { Module, OnModuleInit } from "@nestjs/common";
import { CqrsModule, EventPublisher } from "@nestjs/cqrs";
import { EventStoreModule } from "../../event-store/event-store.module";
import { EventStorePublisher } from "../../event-store/event-store.publisher";
import { EventType } from "../../events/sensor/events/event-type";
import { RetrieveSensorQueryHandler } from "./queries/sensor.handler";
import { RetrieveSensorsQueryHandler } from "./queries/sensors.handler";
import { SensorCreatedProcessor, SensorUpdatedProcessor, SensorDeletedProcessor, 
  SensorActivatedProcessor, SensorDeActivatedProcessor, SensorOwnershipSharedProcessor, 
  SensorOwnershipTransferredProcessor, SensorLocationUpdatedProcessor, 
  DataStreamCreatedProcessor, DataStreamDeletedProcessor } from './processors';


@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    SensorQueryModule
  ],
  controllers: [SensorController],
  providers: [
    EventPublisher,
    SensorCreatedProcessor,
    SensorUpdatedProcessor,
    SensorDeletedProcessor,
    SensorActivatedProcessor,
    SensorDeActivatedProcessor,
    RetrieveSensorQueryHandler,
    RetrieveSensorsQueryHandler,
    SensorOwnershipSharedProcessor,
    SensorOwnershipTransferredProcessor,
    SensorLocationUpdatedProcessor,
    DataStreamCreatedProcessor,
    DataStreamDeletedProcessor
  ]
})

export class SensorQueryModule implements OnModuleInit {
  constructor(
    private readonly eventStore: EventStorePublisher,
    private readonly sensorCreatedProcessor: SensorCreatedProcessor,
    private readonly sensorUpdatedProcessor: SensorUpdatedProcessor,
    private readonly sensorDeletedProcessor: SensorDeletedProcessor,
    private readonly sensorActivatedProcessor: SensorActivatedProcessor,
    private readonly sensorDeActivatedProcessor: SensorDeActivatedProcessor,
    private readonly sensorOwnershipSharedProcessor: SensorOwnershipSharedProcessor,
    private readonly sensorOwnershipTransferredProcessor: SensorOwnershipTransferredProcessor,
    private readonly sensorLocationUpdatedProcessor: SensorLocationUpdatedProcessor,
    private readonly dataStreamCreatedProcessor: DataStreamCreatedProcessor,
    private readonly dataStreamDeletedProcessor: DataStreamDeletedProcessor
  ) {}
  onModuleInit() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const database = process.env.MONGO_DATABASE || 'sensrnet';

    const url = 'mongodb://' + host + ':' + port.toString() + '/' + database;
    connect(url, { useNewUrlParser: true , useUnifiedTopology: true});

    const onEvent = (_, event) => {
      if (event.eventType == EventType.SensorCreated) {
        this.sensorCreatedProcessor.process(event);
      } else if (event.eventType == EventType.Updated) {
        this.sensorUpdatedProcessor.process(event);
      } else if (event.eventType == EventType.Deleted) {
        this.sensorDeletedProcessor.process(event);
      } else if (event.eventType == EventType.Activated) {
        this.sensorActivatedProcessor.process(event);
      } else if (event.eventType == EventType.Deactivated) {
        this.sensorDeActivatedProcessor.process(event);
      } else if (event.eventType == EventType.OwnershipShared) {
        this.sensorOwnershipSharedProcessor.process(event);
      } else if (event.eventType == EventType.LocationUpdated) {
        this.sensorLocationUpdatedProcessor.process(event);
      } else if (event.eventType == EventType.DataStreamCreated) {
        this.dataStreamCreatedProcessor.process(event);
      } else if (event.eventType == EventType.DataStreamDeleted) {
        this.dataStreamDeletedProcessor.process(event);
      } else if (event.eventType == EventType.OwnershipTransferred) {
        this.sensorOwnershipTransferredProcessor.process(event);
      }
    };

    this.eventStore.subscribeToStream('$ce-sensor', onEvent, () => {});
  }
}
