import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatastreamAdded, DatastreamRemoved, DatastreamUpdated, ObservationGoalLinked, ObservationGoalUnlinked } from '../../core/events/sensordevice/datastream';
import { DeviceLocated, DeviceRegistered, DeviceRelocated, DeviceRemoved, DeviceUpdated } from '../../core/events/sensordevice/device';
import { SensorAdded, SensorRemoved, SensorUpdated } from '../../core/events/sensordevice/sensor';
import { SensorDeviceEvent } from '../../core/events/sensordevice/sensordevice.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { Gateway } from '../gateway/gateway';
import { IDevice } from '../model/device.model';
import { IObservationGoal } from '../model/observation-goal.model';
import { IRelation, RelationVariant, TargetVariant } from '../model/relation.model';
import { AbstractProcessor } from './abstract.processor';

@Injectable()
export class DeviceProcessor extends AbstractProcessor {

  constructor(
    eventStore: EventStorePublisher,
    private readonly gateway: Gateway,
    @InjectModel('Device') private deviceModel: Model<IDevice>,
    @InjectModel('Relation') public relationModel: Model<IRelation>,
    @InjectModel('ObservationGoal') private observationGoalModel: Model<IObservationGoal>,
  ) {
    super(eventStore, relationModel);
  }

  async process(event: SensorDeviceEvent): Promise<void> {
    let device: IDevice;
    let legalEntityIds: string[];

    if (event instanceof DeviceRegistered) {
      device = await this.processDeviceRegistered(event);
      legalEntityIds = await this.getDeviceLegalEntityIds(event);
    } else if (event instanceof DeviceUpdated) {
      device = await this.processDeviceUpdated(event);
      legalEntityIds = await this.getDeviceLegalEntityIds(event);
    } else if (event instanceof DeviceRemoved) {
      legalEntityIds = await this.getDeviceLegalEntityIds(event);
      device = await this.processDeviceDeleted(event);
    } else if (event instanceof DeviceLocated) {
      device = await this.processDeviceLocated(event);
      legalEntityIds = await this.getDeviceLegalEntityIds(event);
    } else if (event instanceof DeviceRelocated) {
      device = await this.processDeviceRelocated(event);
      legalEntityIds = await this.getDeviceLegalEntityIds(event);
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
    } else if (event instanceof ObservationGoalLinked) {
      await this.processObservationGoalLinked(event);
    } else if (event instanceof ObservationGoalUnlinked) {
      await this.processObservationGoalUnlinked(event);
    }

    if (device && legalEntityIds) {
      this.gateway.emit(event.constructor.name, legalEntityIds, {canEdit: true, ...device.toObject()});
    }
  }

  async getDeviceLegalEntityIds(eventRecord: Record<string, any>): Promise<string[]> {
    const relationFilter = { targetVariant: TargetVariant.DEVICE, targetId: eventRecord.deviceId };
    const relationResult = { _id: 0, legalEntityId: 1 };
    const legalEntityIds = await this.relationModel.find(relationFilter, relationResult);

    return legalEntityIds.map(x => x.legalEntityId);
  }

  async processDeviceRegistered(event: DeviceRegistered): Promise<IDevice> {
    const deviceData: Record<string, any> = {
      _id: event.deviceId,
      name: event.name,
      description: event.description,
      category: event.category,
      connectivity: event.connectivity,
    };

    let device;
    try {
      device = await new this.deviceModel(deviceData).save();
      await this.saveRelation(event.legalEntityId, RelationVariant.RESPONSIBLE, TargetVariant.DEVICE, event.deviceId);
    } catch {
      this.errorCallback(event);
    }

    return device as IDevice;
  }

  async processDeviceUpdated(event: DeviceUpdated): Promise<IDevice> {
    const deviceUpdate: Record<string, any> = {};

    if (AbstractProcessor.defined(event.name)) {
      deviceUpdate.name = event.name;
    }
    if (AbstractProcessor.defined(event.description)) {
      deviceUpdate.description = event.description;
    }
    if (AbstractProcessor.defined(event.category)) {
      deviceUpdate.category = event.category;
    }
    if (AbstractProcessor.defined(event.connectivity)) {
      deviceUpdate.connectivity = event.connectivity;
    }

    let device;
    try {
      device = await this.deviceModel.findOneAndUpdate({ _id: event.deviceId }, { $set: deviceUpdate }, { new: true });
    } catch {
      this.errorCallback(event);
    }

    return device;
  }

  async processDeviceLocated(event: DeviceLocated): Promise<IDevice> {
    const deviceUpdate: Record<string, any> = {};

    const locationDetails: Record<string, any> = {};
    if (AbstractProcessor.defined(event.name)) {
      locationDetails.name = event.name;
    }
    if (AbstractProcessor.defined(event.description)) {
      locationDetails.description = event.description;
    }
    if (Object.keys(locationDetails).length) {
      deviceUpdate.locationDetails = locationDetails;
    }
    if (AbstractProcessor.defined(event.location)) {
      deviceUpdate.location = {
        type: 'Point',
        coordinates: event.location,
      };
    }

    let device;
    try {
      device = await this.deviceModel.findOneAndUpdate({ _id: event.deviceId }, { $set: deviceUpdate }, { new: true });
    } catch {
      this.errorCallback(event);
    }

    return device;
  }

  async processDeviceRelocated(event: DeviceRelocated): Promise<IDevice> {
    return await this.processDeviceLocated(event);
  }

  async processDeviceDeleted(event: DeviceRemoved): Promise<IDevice> {
    let device;

    try {
      await this.deleteRelations(event.legalEntityId, TargetVariant.DEVICE, event.deviceId);

      device = await this.deviceModel.findOneAndDelete({ _id: event.deviceId });
      await this.eventStore.deleteStream(SensorDeviceEvent.getStreamName(SensorDeviceEvent.streamRootValue, event.deviceId));
    } catch {
      this.errorCallback(event);
    }

    return device;
  }

  async processSensorAdded(event: SensorAdded): Promise<void> {
    const sensorData = {
      _id: event.sensorId,
      name: event.name,
      description: event.description,
      type: event.type,
      manufacturer: event.manufacturer,
      supplier: event.supplier,
      documentation: event.documentation,
    };

    const sensorFilter = {
      '_id': event.deviceId,
      'sensors._id': { $ne: event.sensorId },
    };

    try {
      await this.deviceModel.updateOne(sensorFilter, { $push: { sensors: sensorData } });
    } catch {
      this.errorCallback(event);
    }
  }

  async processSensorUpdated(event: SensorUpdated): Promise<void> {
    const sensorFilter = {
      '_id': event.deviceId,
      'sensors._id': event.sensorId,
    };

    const sensorUpdate: Record<string, any> = {};
    if (AbstractProcessor.defined(event.name)) {
      sensorUpdate['sensors.$.name'] = event.name;
    }
    if (AbstractProcessor.defined(event.description)) {
      sensorUpdate['sensors.$.description'] = event.description;
    }
    if (AbstractProcessor.defined(event.type)) {
      sensorUpdate['sensors.$.type'] = event.type;
    }
    if (AbstractProcessor.defined(event.manufacturer)) {
      sensorUpdate['sensors.$.manufacturer'] = event.manufacturer;
    }
    if (AbstractProcessor.defined(event.supplier)) {
      sensorUpdate['sensors.$.supplier'] = event.supplier;
    }
    if (AbstractProcessor.defined(event.documentation)) {
      sensorUpdate['sensors.$.documentation'] = event.documentation;
    }

    try {
      await this.deviceModel.updateOne(sensorFilter, { $set: sensorUpdate });
    } catch {
      this.errorCallback(event);
    }
  }

  async processSensorRemoved(event: SensorRemoved): Promise<void> {
    await this.deviceModel.updateOne({ _id: event.deviceId }, { $pull: { sensors: { _id: event.sensorId } } });
  }

  async processDatastreamAdded(event: DatastreamAdded): Promise<void> {
    const dataStreamData = {
      _id: event.dataStreamId,
      sensorId: event.sensorId,
      name: event.name,
      description: event.description,
      unitOfMeasurement: event.unitOfMeasurement,
      observationArea: event.observationArea,
      theme: event.theme,
      dataQuality: event.dataQuality,
      isActive: !!event.isActive,
      isPublic: !!event.isPublic,
      isOpenData: !!event.isOpenData,
      containsPersonalInfoData: !!event.containsPersonalInfoData,
      isReusable: !!event.isReusable,
      documentation: event.documentation,
      dataLink: event.dataLink,
    };

    const dataStreamFilter = {
      '_id': event.deviceId,
      'dataStreams._id': { $ne: event.dataStreamId },
    };

    try {
      await this.deviceModel.updateOne(dataStreamFilter, { $push: { dataStreams: dataStreamData } });
    } catch {
      this.errorCallback(event);
    }
  }

  async processDatastreamUpdated(event: DatastreamUpdated): Promise<void> {
    const dataStreamFilter = {
      '_id': event.deviceId,
      'dataStreams._id': event.dataStreamId,
    };

    const dataStreamUpdate: Record<string, any> = {};
    if (AbstractProcessor.defined(event.name)) {
      dataStreamUpdate['dataStreams.$.name'] = event.name;
    }
    if (AbstractProcessor.defined(event.description)) {
      dataStreamUpdate['dataStreams.$.description'] = event.description;
    }
    if (AbstractProcessor.defined(event.unitOfMeasurement)) {
      dataStreamUpdate['dataStreams.$.unitOfMeasurement'] = event.unitOfMeasurement;
    }
    if (AbstractProcessor.defined(event.observationArea)) {
      dataStreamUpdate['dataStreams.$.observationArea'] = event.observationArea;
    }
    if (AbstractProcessor.defined(event.theme)) {
      dataStreamUpdate['dataStreams.$.theme'] = event.theme;
    }
    if (AbstractProcessor.defined(event.dataQuality)) {
      dataStreamUpdate['dataStreams.$.dataQuality'] = event.dataQuality;
    }
    if (AbstractProcessor.defined(event.isActive)) {
      dataStreamUpdate['dataStreams.$.isActive'] = !!event.isActive;
    }
    if (AbstractProcessor.defined(event.isPublic)) {
      dataStreamUpdate['dataStreams.$.isPublic'] = !!event.isPublic;
    }
    if (AbstractProcessor.defined(event.isOpenData)) {
      dataStreamUpdate['dataStreams.$.isOpenData'] = !!event.isOpenData;
    }
    if (AbstractProcessor.defined(event.containsPersonalInfoData)) {
      dataStreamUpdate['dataStreams.$.containsPersonalInfoData'] = !!event.containsPersonalInfoData;
    }
    if (AbstractProcessor.defined(event.isReusable)) {
      dataStreamUpdate['dataStreams.$.isReusable'] = !!event.isReusable;
    }
    if (AbstractProcessor.defined(event.documentation)) {
      dataStreamUpdate['dataStreams.$.documentation'] = event.documentation;
    }
    if (AbstractProcessor.defined(event.dataLink)) {
      dataStreamUpdate['dataStreams.$.dataLink'] = event.dataLink;
    }

    try {
      await this.deviceModel.updateOne(dataStreamFilter, { $set: dataStreamUpdate });
    } catch {
      this.errorCallback(event);
    }
  }

  async processDatastreamRemoved(event: DatastreamRemoved): Promise<void> {
    const dataStreamFilter = { _id: event.deviceId };
    const dataStreamRemove = { $pull: { dataStreams: { _id: event.dataStreamId } } };
    try {
      await this.deviceModel.updateOne(dataStreamFilter, dataStreamRemove);
    } catch {
      this.errorCallback(event);
    }
  }

  async processObservationGoalLinked(event: ObservationGoalLinked): Promise<void> {
    const dataStreamFilter = {
      '_id': event.deviceId,
      'dataStreams._id': event.dataStreamId,
      'dataStreams.observationGoalIds': { $ne: event.observationGoalId },
    };

    const dataStreamUpdate = {
      $push: {
        'dataStreams.$.observationGoalIds': event.observationGoalId,
      },
    };

    try {
      await this.deviceModel.updateOne(dataStreamFilter, dataStreamUpdate);
    } catch {
      this.errorCallback(event);
    }
  }

  async processObservationGoalUnlinked(event: ObservationGoalUnlinked): Promise<void> {
    const dataStreamFilter = {
      '_id': event.deviceId,
      'dataStreams._id': event.dataStreamId,
    };

    const dataStreamUpdate = {
      $pull: {
        'dataStreams.$.observationGoalIds': event.observationGoalId,
      },
    };

    try {
      await this.deviceModel.updateOne(dataStreamFilter, dataStreamUpdate);
    } catch {
      this.errorCallback(event);
    }
  }
}
