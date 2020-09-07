import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ISensor } from '../data/sensor.model';
import { Injectable, Logger } from '@nestjs/common';
import { SensorGateway } from '../gateway/sensor.gateway';
import { SensorEvent } from '../../core/events/sensor/sensor.event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { DatastreamAdded, DatastreamDeleted, SensorActivated, SensorDeactivated, SensorDeleted,
  SensorOwnershipShared, SensorOwnershipTransferred, SensorRegistered, SensorRelocated, SensorUpdated } from '../../core/events/sensor';

@Injectable()
export class SensorProcessor {
  /* This processor processes sensor events. Events like soft-delete are not handled because they do not need to be processed. */

  constructor(
      private readonly sensorGateway: SensorGateway,
      private readonly eventStore: EventStorePublisher,
      @InjectModel('Sensor') private sensorModel: Model<ISensor>,
  ) {
  }

  private errorCallback(error: any): void {
    if (error) {
      this.logError(error);
    }
  }

  private logError(event) {
    this.logger.error(`Error while updating projection for ${event.eventType}.`);
  }

  private async updateSensorById(sensorId, sensorData, event) {
    let sensor: ISensor;
    try {
      sensor = await this.sensorModel.findByIdAndUpdate(
          sensorId,
          sensorData,
          {new: true},
          ).exec();
    } catch {
      this.errorCallback(event);
    }

    return sensor;
  }

  protected logger: Logger = new Logger(this.constructor.name);

  async process(event: SensorEvent): Promise<void> {
    let result: ISensor;
    if (event instanceof SensorRegistered) {
      result = await this.processCreated(event);
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
    } else if (event instanceof DatastreamDeleted) {
      result = await this.processDataStreamDeleted(event);
    } else if (event instanceof SensorRelocated) {
      result = await this.processLocationUpdated(event);
    }

    if (result) {
      this.sensorGateway.emit(event.constructor.name, result.toObject());
    }
  }

  async processCreated(event: SensorRegistered): Promise<ISensor> {
    let sensorData = {};
    sensorData = {
      _id: event.sensorId,
      nodeId: event.nodeId,
      location: {
        type: 'Point',
        coordinates: [event.longitude, event.latitude, event.height],
      },
      active: event.active,
      typeName: event.typeName,
    };

    if (event.ownerId) {
      sensorData = {...sensorData, ownerIds: [event.ownerId]};
    }
    if (event.baseObjectId) {
      sensorData = {...sensorData, baseObjectId: event.baseObjectId};
    }
    if (event.name) {
      sensorData = {...sensorData, name: event.name};
    }
    if (event.aim) {
      sensorData = {...sensorData, aim: event.aim};
    }
    if (event.description) {
      sensorData = {...sensorData, description: event.description};
    }
    if (event.manufacturer) {
      sensorData = {...sensorData, manufacturer: event.manufacturer};
    }
    if (event.observationArea) {
      sensorData = {...sensorData, observationArea: event.observationArea};
    }
    if (event.documentationUrl) {
      sensorData = {...sensorData, documentationUrl: event.documentationUrl};
    }
    if (event.theme) {
      sensorData = {...sensorData, theme: event.theme};
    }
    if (event.typeDetails) {
      sensorData = {...sensorData, typeDetails: event.typeDetails};
    }

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

    if (event.typeName) {
      sensorData = {...sensorData, typeName: event.typeName};
    }
    if (event.name) {
      sensorData = {...sensorData, name: event.name};
    }
    if (event.aim) {
      sensorData = {...sensorData, aim: event.aim};
    }
    if (event.description) {
      sensorData = {...sensorData, description: event.description};
    }
    if (event.manufacturer) {
      sensorData = {...sensorData, manufacturer: event.manufacturer};
    }
    if (event.observationArea) {
      sensorData = {...sensorData, observationArea: event.observationArea};
    }
    if (event.documentationUrl) {
      sensorData = {...sensorData, documentationUrl: event.documentationUrl};
    }
    if (event.theme) {
      sensorData = {...sensorData, theme: event.theme};
    }
    if (event.typeDetails) {
      sensorData = {...sensorData, typeDetails: event.typeDetails};
    }

    return await this.updateSensorById(event.sensorId, sensorData, event);
  }

  async processDeleted(event: SensorDeleted): Promise<ISensor> {
    const sensor: ISensor = await this.sensorModel.findByIdAndDelete(
      event.sensorId,
    ).exec();

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
        ownerIds: {
          $each: event.ownerIds,
        },
      },
    };

    return await this.updateSensorById(event.sensorId, updateSensorData, event);
  }

  async processOwnershipTransferred(event: SensorOwnershipTransferred): Promise<ISensor> {
    const filterData = {
      _id: event.sensorId,
      ownerIds: event.oldOwnerId,
    };

    const updateSensorData = {
      $set: {
        'ownerIds.$': event.newOwnerId,
      },
    };

    let sensor: ISensor;
    try {
      sensor = await this.sensorModel.findOneAndUpdate(
        filterData,
        updateSensorData,
        {new: true},
      ).exec();
    } catch {
      this.errorCallback(event);
    }

    return sensor;
  }

  async processDataStreamCreated(event: DatastreamAdded): Promise<ISensor> {
    let dataStreamData = {};
    dataStreamData = {
      dataStreamId: event.dataStreamId,
      name: event.name,
      isPublic: event.isPublic,
      isOpenData: event.isOpenData,
      isReusable: event.isReusable,
    };

    if (event.reason) {
      dataStreamData = {...dataStreamData, reason: event.reason};
    }
    if (event.description) {
      dataStreamData = {...dataStreamData, description: event.description};
    }
    if (event.observedProperty) {
      dataStreamData = {...dataStreamData, observedProperty: event.observedProperty};
    }
    if (event.unitOfMeasurement) {
      dataStreamData = {...dataStreamData, unitOfMeasurement: event.unitOfMeasurement};
    }
    if (event.documentationUrl) {
      dataStreamData = {...dataStreamData, documentationUrl: event.documentationUrl};
    }
    if (event.dataLink) {
      dataStreamData = {...dataStreamData, dataLink: event.dataLink};
    }
    if (event.dataFrequency) {
      dataStreamData = {...dataStreamData, dataFrequency: event.dataFrequency};
    }
    if (event.dataQuality) {
      dataStreamData = {...dataStreamData, dataQuality: event.dataQuality};
    }

    const filterKwargs = {
      '_id': event.sensorId,
      'dataStreams.dataStreamId': { $ne: event.dataStreamId },
    };

    const sensorData = {
      $push: {
        dataStreams: dataStreamData,
      },
    };

    let sensor: ISensor;
    try {
      sensor = await this.sensorModel.findOneAndUpdate(
        filterKwargs,
        sensorData,
        {new: true},
      ).exec();
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

    if (event.baseObjectId) {
      sensorData = {...sensorData, baseObjectId: event.baseObjectId};
    }

    return await this.updateSensorById(event.sensorId, sensorData, event);
  }
}
