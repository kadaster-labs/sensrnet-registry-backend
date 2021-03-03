import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractProcessor } from './abstract.processor';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { DeviceRemoved, DeviceUpdated, DeviceRegistered } from '../../core/events/device';
import { DeviceEvent } from '../../core/events/device/device.event';
import { IDevice } from '../model/device.model';
import { ISensor } from '../model/sensor.model';
import { IDataStream } from '../model/datastream.model';
import { IRelation, RelationVariant } from '../model/relation.model';
import { SensorUpdated } from '../../core/events/sensor/updated';
import { SensorAdded, SensorRemoved } from '../../core/events/sensor';
import { DatastreamAdded } from '../../core/events/data-stream/added';
import { DatastreamUpdated } from '../../core/events/data-stream/updated';
import { DatastreamRemoved } from '../../core/events/data-stream/removed';
import { ObservationGoalAdded } from '../../core/events/observation-goal/added';
import { ObservationGoalUpdated } from '../../core/events/observation-goal/updated';
import { ObservationGoalRemoved } from '../../core/events/observation-goal/removed';

@Injectable()
export class DeviceProcessor extends AbstractProcessor {

  constructor(
      eventStore: EventStorePublisher,
      @InjectModel('Device') private deviceModel: Model<IDevice>,
      @InjectModel('Sensor') private sensorModel: Model<ISensor>,
      @InjectModel('Relation') public relationModel: Model<IRelation>,
      @InjectModel('DataStream') private dataStreamModel: Model<IDataStream>,
  ) {
    super(eventStore, relationModel);
  }

  async process(event: DeviceEvent): Promise<void> {
    if (event instanceof DeviceRegistered) {
      await this.processDeviceRegistered(event);
    } else if (event instanceof DeviceUpdated) {
      await this.processDeviceUpdated(event);
    } else if (event instanceof DeviceRemoved) {
      await this.processDeviceDeleted(event);
    } else if (event instanceof SensorAdded) {
      await this.processSensorAdded(event);
    } else if (event instanceof SensorUpdated) {
      await this.processSensorUpdated(event);
    } else if (event instanceof SensorRemoved) {
      await this.processSensorRemoved(event);
    } else if (event instanceof DatastreamAdded) {
      await this.processDatastreamAdded(event);
    } else if (event instanceof DatastreamUpdated) {
      await this.processDatastreamUpdated(event);
    } else if (event instanceof DatastreamRemoved) {
      await this.processDatastreamRemoved(event);
    } else if (event instanceof ObservationGoalAdded) {
      await this.processObservationGoalAdded(event);
    } else if (event instanceof ObservationGoalUpdated) {
      await this.processObservationGoalUpdated(event);
    } else if (event instanceof ObservationGoalRemoved) {
      await this.processObservationGoalRemoved(event);
    }
  }

  async processDeviceRegistered(event: DeviceRegistered): Promise<void> {
    const deviceData: Record<string, any> = {
      _id: event.deviceId,
      name: event.name,
      description: event.description,
      category: event.category,
      connectivity: event.connectivity,
      locationName: event.location.name,
      locationDescription: event.location.description,
      location: {
        type: 'Point',
        coordinates: event.location.location,
      },
    };
    try {
      await new this.deviceModel(deviceData).save();
    } catch (e) {
      Logger.warn(e);
      this.errorCallback(event);
    }

    await this.saveRelation(event.legalEntityId, RelationVariant.DEVICE_OWNER, event.deviceId);
  }

  async processDeviceUpdated(event: DeviceUpdated): Promise<void> {
    const deviceUpdate: Record<string, any> = {};

    if (AbstractProcessor.defined(event.name)) { deviceUpdate.name = event.name; }
    if (AbstractProcessor.defined(event.description)) { deviceUpdate.description = event.description; }
    if (AbstractProcessor.defined(event.category)) { deviceUpdate.category = event.category; }
    if (AbstractProcessor.defined(event.connectivity)) { deviceUpdate.connectivity = event.connectivity; }
    if (AbstractProcessor.defined(event.location)) {
      if (AbstractProcessor.defined(event.location.name)) {
        deviceUpdate.locationName = event.location.name;
      }
      if (AbstractProcessor.defined(event.location.description)) {
        deviceUpdate.locationDescription = event.location.description;
      }
      if (AbstractProcessor.defined(event.location.location)) {
        deviceUpdate.location = {
          type: 'Point',
          coordinates: event.location.location,
        };
      }
    }

    try {
      await this.deviceModel.updateOne({_id: event.deviceId}, deviceUpdate);
    } catch {
      this.errorCallback(event);
    }
  }

  async processDeviceDeleted(event: DeviceRemoved): Promise<void> {
    const deviceFilter = {_id: event.deviceId};
    await this.sensorModel.deleteMany(deviceFilter);
    await this.dataStreamModel.deleteMany(deviceFilter);

    await this.deleteRelations(event.deviceId);
    await this.deviceModel.deleteOne(deviceFilter);

    await this.eventStore.deleteStream(DeviceEvent.getStreamName(DeviceEvent.streamRootValue, event.deviceId));
  }

  async processSensorAdded(event: SensorAdded): Promise<void> {
    const sensorData = {
      _id: event.sensorId,
      name: event.name,
      deviceId: event.deviceId,
      description: event.description,
      type: event.type,
      manufacturer: event.manufacturer,
      supplier: event.supplier,
      documentation: event.documentation,
    };

    try {
      await new this.sensorModel(sensorData).save();
    } catch {
      this.errorCallback(event);
    }
  }

  async processSensorUpdated(event: SensorUpdated): Promise<void> {
    const sensorUpdate: Record<string, any> = {};

    if (AbstractProcessor.defined(event.name)) { sensorUpdate.name = event.name; }
    if (AbstractProcessor.defined(event.description)) { sensorUpdate.description = event.description; }
    if (AbstractProcessor.defined(event.type)) { sensorUpdate.type = event.type; }
    if (AbstractProcessor.defined(event.manufacturer)) { sensorUpdate.manufacturer = event.manufacturer; }
    if (AbstractProcessor.defined(event.supplier)) { sensorUpdate.supplier = event.supplier; }
    if (AbstractProcessor.defined(event.documentation)) { sensorUpdate.documentation = event.documentation; }

    try {
      await this.sensorModel.updateOne({_id: event.sensorId}, sensorUpdate);
    } catch {
      this.errorCallback(event);
    }
  }

  async processSensorRemoved(event: SensorRemoved): Promise<void> {
    await this.sensorModel.deleteMany({_id: event.sensorId});
  }

  async processDatastreamAdded(event: DatastreamAdded): Promise<void> {
    const dataStreamData: Record<string, any> = {
      _id: event.dataStreamId,
      sensorId: event.sensorId,
      deviceId: event.deviceId,
      name: event.name,
      isActive: !!event.isActive,
      isPublic: !!event.isPublic,
      isOpenData: !!event.isOpenData,
      isReusable: !!event.isReusable,
      containsPersonalInfoData: !!event.containsPersonalInfoData,
    };

    if (AbstractProcessor.defined(event.description)) { dataStreamData.description = event.description; }
    if (AbstractProcessor.defined(event.unitOfMeasurement)) { dataStreamData.unitOfMeasurement = event.unitOfMeasurement; }
    if (AbstractProcessor.defined(event.observationArea)) { dataStreamData.observationArea = event.observationArea; }
    if (AbstractProcessor.defined(event.theme)) { dataStreamData.theme = event.theme; }
    if (AbstractProcessor.defined(event.dataQuality)) { dataStreamData.dataQuality = event.dataQuality; }
    if (AbstractProcessor.defined(event.documentation)) { dataStreamData.documentation = event.documentation; }
    if (AbstractProcessor.defined(event.dataLink)) { dataStreamData.dataLink = event.dataLink; }

    await new this.dataStreamModel(dataStreamData).save();
  }

  async processDatastreamUpdated(event: DatastreamUpdated): Promise<void> {
    const dataStreamUpdate: Record<string, any> = {};

    if (AbstractProcessor.defined(event.name)) { dataStreamUpdate.name = event.name; }
    if (AbstractProcessor.defined(event.description)) { dataStreamUpdate.description = event.description; }
    if (AbstractProcessor.defined(event.unitOfMeasurement)) { dataStreamUpdate.unitOfMeasurement = event.unitOfMeasurement; }
    if (AbstractProcessor.defined(event.observationArea)) { dataStreamUpdate.observationArea = event.observationArea; }
    if (AbstractProcessor.defined(event.theme)) { dataStreamUpdate.theme = event.theme; }
    if (AbstractProcessor.defined(event.dataQuality)) { dataStreamUpdate.dataQuality = event.dataQuality; }
    if (AbstractProcessor.defined(event.isActive)) { dataStreamUpdate.isActive = !!event.isActive; }
    if (AbstractProcessor.defined(event.isPublic)) { dataStreamUpdate.isPublic = !!event.isPublic; }
    if (AbstractProcessor.defined(event.isOpenData)) { dataStreamUpdate.isOpenData = !!event.isOpenData; }
    if (AbstractProcessor.defined(event.containsPersonalInfoData)) { dataStreamUpdate.containsPersonalInfoData = !!event.containsPersonalInfoData; }
    if (AbstractProcessor.defined(event.isReusable)) { dataStreamUpdate.isReusable = !!event.isReusable; }
    if (AbstractProcessor.defined(event.documentation)) { dataStreamUpdate.documentation = event.documentation; }
    if (AbstractProcessor.defined(event.dataLink)) { dataStreamUpdate.dataLink = event.dataLink; }

    try {
      await this.dataStreamModel.updateOne({_id: event.dataStreamId}, dataStreamUpdate);
    } catch {
      this.errorCallback(event);
    }
  }

  async processDatastreamRemoved(event: DatastreamRemoved): Promise<void> {
    await this.dataStreamModel.deleteMany({_id: event.dataStreamId});
  }

  async processObservationGoalAdded(event: ObservationGoalAdded): Promise<void> {
    await this.dataStreamModel.updateOne(
        { _id: event.dataStreamId },
        { $push: {
          observationGoals: {
            _id: event.observationGoalId,
            name: event.name,
            description: event.description,
            legalGround: event.legalGround,
            legalGroundLink: event.legalGroundLink,
          },
        }},
    );
  }

  async processObservationGoalUpdated(event: ObservationGoalUpdated): Promise<void> {
    const filter = {
      '_id': event.dataStreamId,
      'observationGoals._id': event.observationGoalId,
    };
    const updateObservationGoal: Record<string, any> = {};
    if (event.name) { updateObservationGoal['observationGoals.$.name'] = event.name; }
    if (event.description) { updateObservationGoal['observationGoals.$.description'] = event.description; }
    if (event.legalGround) { updateObservationGoal['observationGoals.$.legalGround'] = event.legalGround; }
    if (event.legalGroundLink) { updateObservationGoal['observationGoals.$.legalGroundLink'] = event.legalGroundLink; }

    try {
      await this.dataStreamModel.updateOne(filter, {
        $set: updateObservationGoal,
      });
    } catch {
      this.errorCallback(event);
    }
  }

  async processObservationGoalRemoved(event: ObservationGoalRemoved): Promise<void> {
    const filter = {
      '_id': event.dataStreamId,
      'observationGoals._id': event.observationGoalId,
    };
    try {
      await this.dataStreamModel.updateOne(filter, {
        $pull: {
          observationGoals: {
            _id: event.observationGoalId,
          },
        },
      });
    } catch {
      this.errorCallback(event);
    }
  }
}
