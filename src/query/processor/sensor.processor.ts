import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISensor } from '../data/sensor.model';
import { AbstractProcessor } from './abstract.processor';
import { SensorGateway } from '../gateway/sensor.gateway';
import { SensorEvent } from '../../core/events/sensor/sensor.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import {
  DatastreamAdded, DatastreamDeleted, DatastreamUpdated, SensorActivated, SensorDeactivated, SensorDeleted,
  SensorOwnershipShared, SensorOwnershipTransferred, SensorRegistered, SensorRelocated, SensorUpdated,
} from '../../core/events/sensor';

@Injectable()
export class SensorProcessor extends AbstractProcessor {
  /* This processor processes sensor events. Events like soft-delete are not handled because they do not need to be processed. */

  constructor(
      eventStore: EventStorePublisher,
      private readonly sensorGateway: SensorGateway,
      @InjectModel('Sensor') private sensorModel: Model<ISensor>,
  ) {
    super(eventStore);
  }

  private async updateSensorById(sensorId, sensorData, event) {
    let sensor: ISensor;
    try {
      sensor = await this.sensorModel.findByIdAndUpdate(sensorId, sensorData, {new: true});
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
    } else if (event instanceof SensorActivated) {
      result = await this.processActivated(event);
    } else if (event instanceof SensorDeactivated) {
      result = await this.processDeactivated(event);
    } else if (event instanceof SensorOwnershipShared) {
      result = await this.processOwnershipShared(event);
    } else if (event instanceof SensorOwnershipTransferred) {
      result = await this.processOwnershipTransferred(event);
    } else if (event instanceof DatastreamAdded) {
      result = await this.processDataStreamCreated(event);
    } else if (event instanceof DatastreamUpdated) {
      result = await this.processDataStreamUpdated(event);
    } else if (event instanceof DatastreamDeleted) {
      result = await this.processDataStreamDeleted(event);
    } else if (event instanceof SensorRelocated) {
      result = await this.processLocationUpdated(event);
    }

    if (result) {
      this.sensorGateway.emit(event.constructor.name, result.toObject());
    }
  }

  async processRegistered(event: SensorRegistered): Promise<ISensor> {
    const sensorData = {
      _id: event.sensorId,
      nodeId: event.nodeId,
      location: {
        type: 'Point',
        coordinates: [event.longitude, event.latitude, event.height],
      },
      active: event.active,
      organizations: event.organizationId ? [{id: event.organizationId, role: 'owner'}] : [],
      baseObjectId: event.baseObjectId,
      name: event.name,
      aim: event.aim,
      description: event.description,
      manufacturer: event.manufacturer,
      observationArea: event.observationArea,
      documentationUrl: event.documentationUrl,
      theme: event.theme,
      category: event.category,
      typeName: event.typeName,
      typeDetails: event.typeDetails,
    };

    let sensor: ISensor;
    try {
      sensor = await new this.sensorModel(sensorData).save();
    } catch {
      this.errorCallback(event);
    }

    return sensor;
  }

  async processUpdated(event: SensorUpdated): Promise<ISensor> {
    let sensorData = {};

    if (AbstractProcessor.isDefined(event.name)) {
      sensorData = {...sensorData, name: event.name};
    }
    if (AbstractProcessor.isDefined(event.aim)) {
      sensorData = {...sensorData, aim: event.aim};
    }
    if (AbstractProcessor.isDefined(event.description)) {
      sensorData = {...sensorData, description: event.description};
    }
    if (AbstractProcessor.isDefined(event.manufacturer)) {
      sensorData = {...sensorData, manufacturer: event.manufacturer};
    }
    if (AbstractProcessor.isDefined(event.observationArea)) {
      sensorData = {...sensorData, observationArea: event.observationArea};
    }
    if (AbstractProcessor.isDefined(event.documentationUrl)) {
      sensorData = {...sensorData, documentationUrl: event.documentationUrl};
    }
    if (AbstractProcessor.isDefined(event.theme)) {
      sensorData = {...sensorData, theme: event.theme};
    }
    if (AbstractProcessor.isDefined(event.category)) {
      sensorData = {...sensorData, category: event.category};
    }
    if (AbstractProcessor.isDefined(event.typeName)) {
      sensorData = {...sensorData, typeName: event.typeName};
    }
    if (AbstractProcessor.isDefined(event.typeDetails)) {
      sensorData = {...sensorData, typeDetails: event.typeDetails};
    }

    return await this.updateSensorById(event.sensorId, sensorData, event);
  }

  async processDeleted(event: SensorDeleted): Promise<ISensor> {
    const sensor: ISensor = await this.sensorModel.findByIdAndDelete(event.sensorId);

    const eventMessage = event.toEventMessage();
    await this.eventStore.deleteStream(eventMessage.streamId);

    return sensor;
  }

  async processActivated(event: SensorActivated): Promise<ISensor> {
    const sensorData = {
      active: true,
    };

    return await this.updateSensorById(event.sensorId, sensorData, event);
  }

  async processDeactivated(event: SensorDeactivated): Promise<ISensor> {
    const sensorData = {
      active: false,
    };

    return await this.updateSensorById(event.sensorId, sensorData, event);
  }

  async processOwnershipShared(event: SensorOwnershipShared): Promise<ISensor> {
    const updateSensorData = {
      $addToSet: {
        organizations: [{id: event.organizationId, role: 'owner'}],
      },
    };

    return await this.updateSensorById(event.sensorId, updateSensorData, event);
  }

  async processOwnershipTransferred(event: SensorOwnershipTransferred): Promise<ISensor> {
    const filterData = {
      '_id': event.sensorId,
      'organizations.id': event.oldOrganizationId,
    };
    const updateSensorData = {
      $set: {
        'organizations.$.id': event.newOrganizationId,
      },
    };

    let sensor: ISensor;
    try {
      sensor = await this.sensorModel.findOneAndUpdate(filterData, updateSensorData, {new: true});
    } catch {
      this.errorCallback(event);
    }

    return sensor;
  }

  async processDataStreamCreated(event: DatastreamAdded): Promise<ISensor> {
    let dataStreamData;
    dataStreamData = {
      dataStreamId: event.dataStreamId,
      name: event.name,
      isPublic: !!event.isPublic,
      isOpenData: !!event.isOpenData,
      isReusable: !!event.isReusable,
    };

    if (AbstractProcessor.isDefined(event.reason)) {
      dataStreamData = {...dataStreamData, reason: event.reason};
    }
    if (AbstractProcessor.isDefined(event.description)) {
      dataStreamData = {...dataStreamData, description: event.description};
    }
    if (AbstractProcessor.isDefined(event.observedProperty)) {
      dataStreamData = {...dataStreamData, observedProperty: event.observedProperty};
    }
    if (AbstractProcessor.isDefined(event.unitOfMeasurement)) {
      dataStreamData = {...dataStreamData, unitOfMeasurement: event.unitOfMeasurement};
    }
    if (AbstractProcessor.isDefined(event.documentationUrl)) {
      dataStreamData = {...dataStreamData, documentationUrl: event.documentationUrl};
    }
    if (AbstractProcessor.isDefined(event.dataLink)) {
      dataStreamData = {...dataStreamData, dataLink: event.dataLink};
    }
    if (AbstractProcessor.isDefined(event.dataFrequency)) {
      dataStreamData = {...dataStreamData, dataFrequency: event.dataFrequency};
    }
    if (AbstractProcessor.isDefined(event.dataQuality)) {
      dataStreamData = {...dataStreamData, dataQuality: event.dataQuality};
    }

    const filterKwargs = {
      '_id': event.sensorId,
      'dataStreams.dataStreamId': {
        $ne: event.dataStreamId,
      },
    };
    const sensorData = {
      $push: {
        dataStreams: dataStreamData,
      },
    };

    let sensor: ISensor;
    try {
      sensor = await this.sensorModel.findOneAndUpdate(filterKwargs, sensorData, {new: true});
    } catch {
      this.errorCallback(event);
    }

    return sensor;
  }

  async processDataStreamUpdated(event: DatastreamUpdated): Promise<ISensor> {
    let dataStreamData = {};

    if (AbstractProcessor.isDefined(event.name)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.name': event.name};
    }
    if (AbstractProcessor.isDefined(event.reason)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.reason': event.reason};
    }
    if (AbstractProcessor.isDefined(event.description)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.description': event.description};
    }
    if (AbstractProcessor.isDefined(event.observedProperty)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.observedProperty': event.observedProperty};
    }
    if (AbstractProcessor.isDefined(event.unitOfMeasurement)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.unitOfMeasurement': event.unitOfMeasurement};
    }
    if (AbstractProcessor.isDefined(event.isPublic)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.isPublic': event.isPublic};
    }
    if (AbstractProcessor.isDefined(event.isOpenData)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.isOpenData': event.isOpenData};
    }
    if (AbstractProcessor.isDefined(event.isReusable)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.isReusable': event.isReusable};
    }
    if (AbstractProcessor.isDefined(event.documentationUrl)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.documentationUrl': event.documentationUrl};
    }
    if (AbstractProcessor.isDefined(event.dataLink)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.dataLink': event.dataLink};
    }
    if (AbstractProcessor.isDefined(event.dataFrequency)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.dataFrequency': event.dataFrequency};
    }
    if (AbstractProcessor.isDefined(event.dataQuality)) {
      dataStreamData = {...dataStreamData, 'dataStreams.$.dataQuality': event.dataQuality};
    }

    const filterKwargs = {
      '_id': event.sensorId,
      'dataStreams.dataStreamId': event.dataStreamId,
    };
    const sensorData = {
      $set: dataStreamData,
    };

    let sensor: ISensor;
    try {
      sensor = await this.sensorModel.findOneAndUpdate(filterKwargs, sensorData);
    } catch {
      this.errorCallback(event);
    }

    return sensor;
  }

  async processDataStreamDeleted(event: DatastreamDeleted): Promise<ISensor> {
    const sensorData = {
      $pull: {
        dataStreams: {
          dataStreamId: event.dataStreamId,
        },
      },
    };

    return await this.updateSensorById(event.sensorId, sensorData, event);
  }

  async processLocationUpdated(event: SensorRelocated): Promise<ISensor> {
    let sensorData;
    sensorData = {
      location: {
        type: 'Point',
        coordinates: [event.longitude, event.latitude, event.height],
      },
    };

    if (AbstractProcessor.isDefined(event.baseObjectId)) {
      sensorData = {...sensorData, baseObjectId: event.baseObjectId};
    }

    return await this.updateSensorById(event.sensorId, sensorData, event);
  }
}
