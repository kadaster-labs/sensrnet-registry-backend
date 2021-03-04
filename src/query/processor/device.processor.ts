import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractProcessor } from './abstract.processor';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { DeviceRemoved, DeviceUpdated, DeviceRegistered, DeviceLocated, DeviceRelocated } from '../../core/events/device';
import { DeviceEvent } from '../../core/events/device/device.event';
import { IRelation, RelationVariant } from '../model/relation.model';
import { SensorUpdated } from '../../core/events/sensor/updated';
import { SensorAdded, SensorRemoved } from '../../core/events/sensor';
import { DatastreamAdded } from '../../core/events/datastream/added';
import { DatastreamUpdated } from '../../core/events/datastream/updated';
import { DatastreamRemoved } from '../../core/events/datastream/removed';
import { ObservationGoalAdded } from '../../core/events/observation-goal/added';
import { ObservationGoalUpdated } from '../../core/events/observation-goal/updated';
import { ObservationGoalRemoved } from '../../core/events/observation-goal/removed';
import { IDevice } from '../model/device.model';
import { DeviceGateway } from '../gateway/device.gateway';

@Injectable()
export class DeviceProcessor extends AbstractProcessor {

  constructor(
    eventStore: EventStorePublisher,
    private readonly deviceGateway: DeviceGateway,
    @InjectModel('Device') private deviceModel: Model<IDevice>,
    @InjectModel('Relation') public relationModel: Model<IRelation>,
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
    } else if (event instanceof DeviceLocated) {
      await this.processDeviceLocated(event);
    } else if (event instanceof DeviceRelocated) {
      await this.processDeviceRelocated(event);
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

    if (event instanceof DeviceRegistered || event instanceof DeviceUpdated || event instanceof DeviceRemoved) {
      const device = await this.deviceModel.findOne({ _id: event.deviceId });
      this.deviceGateway.emit(event.constructor.name, [event.legalEntityId], device ? device.toObject() : {});
    }
  }

  async processDeviceRegistered(event: DeviceRegistered): Promise<void> {
    const deviceData: Record<string, any> = {
      _id: event.deviceId,
      name: event.name,
      description: event.description,
      category: event.category,
      connectivity: event.connectivity,
    };

    try {
      await new this.deviceModel(deviceData).save();
      await this.saveRelation(event.legalEntityId, RelationVariant.DEVICE_OWNER, event.deviceId);
    } catch {
      this.errorCallback(event);
    }
  }

  async processDeviceUpdated(event: DeviceUpdated): Promise<void> {
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

    try {
      await this.deviceModel.updateOne({ _id: event.deviceId }, deviceUpdate);
    } catch {
      this.errorCallback(event);
    }
  }

  async processDeviceLocated(event: DeviceLocated): Promise<void> {
    const deviceUpdate: Record<string, any> = {};

    if (AbstractProcessor.defined(event.location)) {
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
    }

    try {
      await this.deviceModel.updateOne({ _id: event.deviceId }, { $set: deviceUpdate });
    } catch {
      this.errorCallback(event);
    }
  }

  async processDeviceRelocated(event: DeviceRelocated): Promise<void> {
    await this.processDeviceLocated(event);
  }

  async processDeviceDeleted(event: DeviceRemoved): Promise<void> {
    try {
      await this.deleteRelations(event.deviceId);
      await this.deviceModel.deleteOne({ _id: event.deviceId });
      await this.eventStore.deleteStream(DeviceEvent.getStreamName(DeviceEvent.streamRootValue, event.deviceId));
    } catch {
      this.errorCallback(event);
    }
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

    try {
      await this.deviceModel.updateOne({ _id: event.deviceId }, { $push: { sensors: sensorData } });
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

    try {
      await this.deviceModel.updateOne({ _id: event.deviceId }, { $push: { dataStreams: dataStreamData } });
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

  async processObservationGoalAdded(event: ObservationGoalAdded): Promise<void> {
    const observationGoalData = {
      _id: event.observationGoalId,
      name: event.name,
      description: event.description,
      legalGround: event.legalGround,
      legalGroundLink: event.legalGroundLink,
    };

    const dataStreamFilter = {
      '_id': event.deviceId,
      'dataStreams._id': event.dataStreamId,
    };

    const dataStreamUpdate = {
      $push: {
        'dataStreams.$.observationGoals': observationGoalData,
      },
    };

    try {
      await this.deviceModel.updateOne(dataStreamFilter, dataStreamUpdate);
    } catch {
      this.errorCallback(event);
    }
  }

  async processObservationGoalUpdated(event: ObservationGoalUpdated): Promise<void> {
    const observationGoalFilter = {
      '_id': event.deviceId,
      'dataStreams._id': event.dataStreamId,
      'dataStreams.observationGoals._id': event.observationGoalId,
    };

    const observationGoalUpdate: Record<string, any> = {};
    if (AbstractProcessor.defined(event.name)) {
      observationGoalUpdate['dataStreams.$[outer].observationGoals.$[inner].name'] = event.name;
    }
    if (AbstractProcessor.defined(event.description)) {
      observationGoalUpdate['dataStreams.$[outer].observationGoals.$[inner].description'] = event.description;
    }
    if (AbstractProcessor.defined(event.legalGround)) {
      observationGoalUpdate['dataStreams.$[outer].observationGoals.$[inner].legalGround'] = event.legalGround;
    }
    if (AbstractProcessor.defined(event.legalGroundLink)) {
      observationGoalUpdate['dataStreams.$[outer].observationGoals.$[inner].legalGroundLink'] = event.legalGroundLink;
    }

    const options = {
      arrayFilters: [{
        'outer._id': event.dataStreamId,
      }, {
        'inner._id': event.observationGoalId,
      }],
    };

    try {
      await this.deviceModel.updateOne(observationGoalFilter, { $set: observationGoalUpdate }, options);
    } catch (e) {
      Logger.warn(e);
      this.errorCallback(event);
    }
  }

  async processObservationGoalRemoved(event: ObservationGoalRemoved): Promise<void> {
    const observationGoalFilter = {
      '_id': event.deviceId,
      'dataStreams._id': event.dataStreamId,
    };

    const observationGoalRemove = { $pull: { 'dataStreams.$.observationGoals': { _id: event.observationGoalId } } };
    try {
      await this.deviceModel.updateOne(observationGoalFilter, observationGoalRemove);
    } catch {
      this.errorCallback(event);
    }
  }
}
