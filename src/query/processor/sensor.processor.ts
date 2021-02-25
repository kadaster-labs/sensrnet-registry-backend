import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISensor } from '../model/sensor.model';
import { AbstractProcessor } from './abstract.processor';
import { SensorGateway } from '../gateway/sensor.gateway';
import { SensorEvent } from '../../core/events/sensor/sensor.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { SensorRegistered, SensorUpdated, SensorDeleted } from '../../core/events/sensor';
import { IDataStream } from '../model/datastream.model';
import { DataStreamEvent } from '../../core/events/data-stream/data-stream.event';
import { IRelation, ObjectVariant, RelationVariant } from '../model/relation.model';

@Injectable()
export class SensorProcessor extends AbstractProcessor {
  /* This processor processes sensor events. Events like soft-delete are not handled because they do not need to be processed. */

  constructor(
      eventStore: EventStorePublisher,
      private readonly sensorGateway: SensorGateway,
      @InjectModel('Sensor') private model: Model<ISensor>,
      @InjectModel('Relation') public relationModel: Model<IRelation>,
      @InjectModel('DataStream') private dataStreamModel: Model<IDataStream>,
  ) {
    super(eventStore, relationModel);
  }

  private async updateSensorById(sensorId, sensorData, event) {
    let sensor: ISensor;
    try {
      sensor = await this.model.findByIdAndUpdate(sensorId, sensorData, {new: true});
    } catch {
      this.errorCallback(event);
    }

    return sensor;
  }

  async process(event: SensorEvent): Promise<void> {
    let result: ISensor;
    if (event instanceof SensorRegistered) {
      result = await this.processRegistered(event);
    } else if (event instanceof SensorUpdated) {
      result = await this.processUpdated(event);
    } else if (event instanceof SensorDeleted) {
      result = await this.processDeleted(event);
    }

    if (result) {
      this.sensorGateway.emit(event.constructor.name, result.toObject());
    }
  }

  async processRegistered(event: SensorRegistered): Promise<ISensor> {
    const sensorData = {
      _id: event.sensorId,
      name: event.name,
      deviceId: event.deviceId,
      description: event.description,
      supplier: event.supplier,
      manufacturer: event.manufacturer,
      documentationUrl: event.documentationUrl,
      active: event.active,
      location: {
        type: 'Point',
        coordinates: event.location,
      },
    };

    // await this.saveRelation(event.legalEntityId, RelationVariant.SENSOR_OWNER, ObjectVariant.SENSOR, event.sensorId);

    let sensor: ISensor;
    try {
      sensor = await new this.model(sensorData).save();
    } catch {
      this.errorCallback(event);
    }

    return sensor;
  }

  async processUpdated(event: SensorUpdated): Promise<ISensor> {
    const sensorUpdate: Record<string, any> = {};

    if (AbstractProcessor.isDefined(event.name)) { sensorUpdate.name = event.name; }
    if (AbstractProcessor.isDefined(event.description)) { sensorUpdate.description = event.description; }
    if (AbstractProcessor.isDefined(event.supplier)) { sensorUpdate.supplier = event.supplier; }
    if (AbstractProcessor.isDefined(event.manufacturer)) { sensorUpdate.manufacturer = event.manufacturer; }
    if (AbstractProcessor.isDefined(event.documentationUrl)) { sensorUpdate.documentationUrl = event.documentationUrl; }
    if (AbstractProcessor.isDefined(event.active)) { sensorUpdate.active = event.active; }

    return await this.updateSensorById(event.sensorId, sensorUpdate, event);
  }

  async processDeleted(event: SensorDeleted): Promise<ISensor> {
    await this.deleteRelations(ObjectVariant.SENSOR, event.sensorId);

    const sensor = await this.model.findOne({_id: event.sensorId});

    if (sensor) {
      const dataStreams = await this.dataStreamModel.find({sensorId: event.sensorId});

      for (const dataStream of dataStreams) {
        await this.deleteRelations(ObjectVariant.DATA_STREAM, dataStream._id);
        await this.dataStreamModel.deleteOne({_id: dataStream._id });

        const dataStreamName = DataStreamEvent.getStreamName(DataStreamEvent.streamRootValue, dataStream._id);
        await this.eventStore.deleteStream(dataStreamName);
      }

      await this.model.deleteOne({_id: event.sensorId });
      const sensorStreamName = SensorEvent.getStreamName(SensorEvent.streamRootValue, event.sensorId);
      await this.eventStore.deleteStream(sensorStreamName);
    }

    return sensor;
  }
}
