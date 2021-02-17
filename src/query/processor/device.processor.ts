import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractProcessor } from './abstract.processor';
import { SensorEvent } from '../../core/events/sensor/sensor.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { DeviceDeleted, DeviceUpdated, DeviceRegistered } from '../../core/events/device';
import { DeviceEvent } from '../../core/events/device/device.event';
import { IDevice } from '../model/device.model';
import { ISensor } from '../model/sensor.model';
import { IDataStream } from '../model/datastream.model';
import { DataStreamEvent } from '../../core/events/data-stream/data-stream.event';
import { IRelation, ObjectVariant, RelationVariant } from '../model/relation.model';

@Injectable()
export class DeviceProcessor extends AbstractProcessor {

  constructor(
      eventStore: EventStorePublisher,
      @InjectModel('Device') private model: Model<IDevice>,
      @InjectModel('Sensor') private sensorModel: Model<ISensor>,
      @InjectModel('Relation') public relationModel: Model<IRelation>,
      @InjectModel('DataStream') private dataStreamModel: Model<IDataStream>,
  ) {
    super(eventStore, relationModel);
  }

  async process(event: SensorEvent): Promise<void> {
    if (event instanceof DeviceRegistered) {
      await this.processDeviceRegistered(event);
    } else if (event instanceof DeviceUpdated) {
      await this.processDeviceUpdated(event);
    } else if (event instanceof DeviceDeleted) {
      await this.processDeviceDeleted(event);
    }
  }

  async processDeviceRegistered(event: DeviceRegistered): Promise<void> {
    const deviceData: Record<string, any> = {
      _id: event.deviceId,
      description: event.description,
      connectivity: event.connectivity,
      location: {
        type: 'Point',
        coordinates: event.location,
      },
    };

    await this.saveRelation(event.legalEntityId, RelationVariant.DEVICE_OWNER, ObjectVariant.DEVICE, event.deviceId);

    await new this.model(deviceData).save();
  }

  async processDeviceUpdated(event: DeviceUpdated): Promise<void> {
    const deviceUpdate: Record<string, any> = {};

    if (AbstractProcessor.isDefined(event.description)) { deviceUpdate.name = event.description; }
    if (AbstractProcessor.isDefined(event.connectivity)) { deviceUpdate.connectivity = event.connectivity; }
    if (AbstractProcessor.isDefined(event.location)) {
      deviceUpdate.location = {
        type: 'Point',
        coordinates: event.location,
      };
    }

    try {
      await this.model.updateOne({_id: event.deviceId}, deviceUpdate);
    } catch {
      this.errorCallback(event);
    }
  }

  async processDeviceDeleted(event: DeviceDeleted): Promise<void> {
    const deviceFilter = {deviceId: event.deviceId};
    const sensors = await this.sensorModel.find(deviceFilter);
    const sensorIds = sensors.map((x) => x._id);

    const sensorFilter = {sensorId: {$in: sensorIds}};
    const dataStreams = await this.dataStreamModel.find(sensorFilter);
    for (const dataStream of dataStreams) {
      await this.deleteRelations(ObjectVariant.DATA_STREAM, dataStream._id);
      await this.eventStore.deleteStream(DataStreamEvent.getStreamName(DataStreamEvent.streamRootValue, dataStream._id));
    }
    await this.dataStreamModel.deleteMany(sensorFilter);

    for (const sensor of sensors) {
      await this.deleteRelations(ObjectVariant.SENSOR, sensor._id);
      await this.eventStore.deleteStream(SensorEvent.getStreamName(SensorEvent.streamRootValue, sensor._id));
    }
    await this.sensorModel.deleteMany(deviceFilter);

    await this.deleteRelations(ObjectVariant.DEVICE, event.deviceId);
    await this.model.deleteOne(deviceFilter);
    await this.eventStore.deleteStream(DeviceEvent.getStreamName(DeviceEvent.streamRootValue, event.deviceId));
  }
}
