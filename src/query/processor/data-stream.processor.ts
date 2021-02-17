import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDataStream } from '../model/datastream.model';
import { AbstractProcessor } from './abstract.processor';
import { SensorEvent } from '../../core/events/sensor/sensor.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { DataStreamEvent } from '../../core/events/data-stream/data-stream.event';
import { DatastreamDeleted, DatastreamUpdated, DatastreamAdded } from '../../core/events/data-stream';
import { IRelation, RelationVariant, ObjectVariant } from '../model/relation.model';

@Injectable()
export class DataStreamProcessor extends AbstractProcessor {

  constructor(
      eventStore: EventStorePublisher,
      @InjectModel('DataStream') private model: Model<IDataStream>,
      @InjectModel('Relation') public relationModel: Model<IRelation>,
  ) {
    super(eventStore, relationModel);
  }

  async process(event: SensorEvent): Promise<void> {
    if (event instanceof DatastreamAdded) {
      await this.processDataStreamRegistered(event);
    } else if (event instanceof DatastreamUpdated) {
      await this.processDataStreamUpdated(event);
    } else if (event instanceof DatastreamDeleted) {
      await this.processDataStreamDeleted(event);
    }
  }

  async processDataStreamRegistered(event: DatastreamAdded): Promise<IDataStream> {
    const dataStreamData: Record<string, any> = {
      _id: event.dataStreamId,
      sensorId: event.sensorId,
      name: event.name,
      isPublic: !!event.isPublic,
      isOpenData: !!event.isOpenData,
      isReusable: !!event.isReusable,
      containsPersonalInfoData: !!event.containsPersonalInfoData,
    };

    if (AbstractProcessor.isDefined(event.description)) { dataStreamData.description = event.description; }
    if (AbstractProcessor.isDefined(event.unitOfMeasurement)) { dataStreamData.unitOfMeasurement = event.unitOfMeasurement; }
    if (AbstractProcessor.isDefined(event.documentationUrl)) { dataStreamData.documentationUrl = event.documentationUrl; }
    if (AbstractProcessor.isDefined(event.dataLink)) { dataStreamData.dataLink = event.dataLink; }
    if (AbstractProcessor.isDefined(event.dataFrequency)) { dataStreamData.dataFrequency = event.dataFrequency; }
    if (AbstractProcessor.isDefined(event.dataQuality)) { dataStreamData.dataQuality = event.dataQuality; }
    if (AbstractProcessor.isDefined(event.theme)) { dataStreamData.theme = event.theme; }
    if (AbstractProcessor.isDefined(event.observation)) {
      dataStreamData.observation = {};
      for (const [k, v] of Object.entries(event.observation)) {
        if (AbstractProcessor.isDefined(v)) {
          dataStreamData.observation[k] = v;
        }
      }
    }

    await this.saveRelation(event.legalEntityId, RelationVariant.DATA_STEWARD, ObjectVariant.DATA_STREAM, event.dataStreamId);

    return await new this.model(dataStreamData).save();
  }

  async processDataStreamUpdated(event: DatastreamUpdated): Promise<void> {
    const dataStreamData: Record<string, any> = {};

    if (AbstractProcessor.isDefined(event.name)) { dataStreamData.name = event.name; }
    if (AbstractProcessor.isDefined(event.isPublic)) { dataStreamData.isPublic = !!event.isPublic; }
    if (AbstractProcessor.isDefined(event.isOpenData)) { dataStreamData.isOpenData = !!event.isOpenData; }
    if (AbstractProcessor.isDefined(event.isReusable)) { dataStreamData.isReusable = !!event.isReusable; }
    if (AbstractProcessor.isDefined(event.containsPersonalInfoData)) { dataStreamData.containsPersonalInfoData = !!event.containsPersonalInfoData; }
    if (AbstractProcessor.isDefined(event.description)) { dataStreamData.description = event.description; }
    if (AbstractProcessor.isDefined(event.unitOfMeasurement)) { dataStreamData.unitOfMeasurement = event.unitOfMeasurement; }
    if (AbstractProcessor.isDefined(event.documentationUrl)) { dataStreamData.documentationUrl = event.documentationUrl; }
    if (AbstractProcessor.isDefined(event.dataLink)) { dataStreamData.dataLink = event.dataLink; }
    if (AbstractProcessor.isDefined(event.dataFrequency)) { dataStreamData.dataFrequency = event.dataFrequency; }
    if (AbstractProcessor.isDefined(event.dataQuality)) { dataStreamData.dataQuality = event.dataQuality; }
    if (AbstractProcessor.isDefined(event.theme)) { dataStreamData.theme = event.theme; }
    if (AbstractProcessor.isDefined(event.observation)) {
      dataStreamData.observation = {};
      for (const [k, v] of Object.entries(event.observation)) {
        if (AbstractProcessor.isDefined(v)) {
          dataStreamData.observation[k] = v;
        }
      }
    }

    try {
      await this.model.updateOne({_id: event.dataStreamId}, dataStreamData);
    } catch {
      this.errorCallback(event);
    }
  }

  async processDataStreamDeleted(event: DatastreamDeleted): Promise<void> {
    await this.deleteRelations(ObjectVariant.DATA_STREAM, event.dataStreamId);

    await this.model.deleteOne({_id: event.dataStreamId});
    const dataStreamName = DataStreamEvent.getStreamName(DataStreamEvent.streamRootValue, event.dataStreamId);
    await this.eventStore.deleteStream(dataStreamName);
  }
}
