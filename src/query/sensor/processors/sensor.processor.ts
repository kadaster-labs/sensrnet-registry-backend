import {Injectable, Logger} from '@nestjs/common';
import {
  DatastreamAdded,
  DatastreamDeleted,
  SensorActivated,
  SensorDeactivated,
  SensorDeleted,
  SensorOwnershipShared,
  SensorOwnershipTransferred,
  SensorRegistered,
  SensorRelocated,
  SensorUpdated,
} from 'src/events/sensor';
import {Sensor} from '../models/sensor.model';
import {SensorGateway} from '../sensor.gateway';

@Injectable()
export class SensorProcessor {
  constructor(
      private readonly sensorGateway: SensorGateway,
  ) {
  }

  async process(event): Promise<void> {

    if (event instanceof SensorRegistered) {
      await this.processCreated(event);
    } else if (event instanceof SensorUpdated) {
      await this.processUpdated(event);
    } else if (event instanceof SensorDeleted) {
      await this.processDeleted(event);
    } else if (event instanceof SensorActivated) {
      await this.processActivated(event);
    } else if (event instanceof SensorDeactivated) {
      await this.processDeactivated(event);
    } else if (event instanceof SensorOwnershipShared) {
      await this.processOwnershipShared(event);
    } else if (event instanceof SensorOwnershipTransferred) {
      await this.processOwnershipTransferred(event);
    } else if (event instanceof DatastreamAdded) {
      await this.processDataStreamCreated(event);
    } else if (event instanceof DatastreamDeleted) {
      await this.processDataStreamDeleted(event);
    } else if (event instanceof SensorRelocated) {
      await this.processLocationUpdated(event);
    } else {
      Logger.warn(`Caught unsupported event: ${event}`);
    }

    this.sensorGateway.emit(event.constructor.name, event);
  }

  async processCreated(event: SensorRegistered): Promise<void> {

    Logger.debug(`processing event ${event.constructor.name} \n${JSON.stringify(event)}`);

    let sensorData = {};
    sensorData = {
      _id: event.sensorId,
      nodeId: event.nodeId,
      location: {
        x: event.x,
        y: event.y,
        z: event.z,
        epsgCode: event.epsgCode,
        baseObjectId: event.baseObjectId,
      },
      active: event.active,
      typeName: event.typeName,
    };

    if (event.ownerIds) {
      sensorData = {...sensorData, ownerIds: event.ownerIds};
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

    await new Sensor(sensorData).save().catch((reason => Logger.warn(`Error saving sensorData: \n${JSON.stringify(sensorData)}`)));
  }

  async processUpdated(event: SensorUpdated): Promise<void> {
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

    Sensor.updateOne({_id: event.sensorId}, sensorData, (err) => {
      if (err) {
        this.logError(event);
      }
    });
  }

  async processDeleted(event: SensorDeleted): Promise<void> {
    Sensor.deleteOne({_id: event.sensorId}, (err) => {
      if (err) {
        Logger.error('Error while deleting projection.');
      }
    });
  }

  async processActivated(event: SensorActivated): Promise<void> {
    const sensorData = {
      active: true,
    };

    Sensor.updateOne({_id: event.sensorId}, sensorData, (err) => {
      if (err) {
        this.logError(event);
      }
    });
  }

  async processDeactivated(event: SensorDeactivated): Promise<void> {
    const sensorData = {
      active: false,
    };

    Sensor.updateOne({_id: event.sensorId}, sensorData, (err) => {
      if (err) {
        this.logError(event);
      }
    });
  }

  async processOwnershipShared(event: SensorOwnershipShared): Promise<void> {
    const updateSensorData = {
      $push: {
        ownerIds: {
          $each: event.ownerIds,
        },
      },
    };

    Sensor.updateOne({_id: event.sensorId}, updateSensorData, (err) => {
      if (err) {
        this.logError(event);
      }
    });
  }

  async processOwnershipTransferred(event: SensorOwnershipTransferred): Promise<void> {
    const filterData = {
      _id: event.sensorId,
      ownerIds: event.oldOwnerId,
    };

    const updateSensorData = {
      $set: {
        'ownerIds.$': event.newOwnerId,
      },
    };

    Sensor.updateOne(filterData, updateSensorData, (err) => {
      if (err) {
        this.logError(event);
      }
    });
  }

  async processDataStreamCreated(event: DatastreamAdded): Promise<void> {
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

    const sensorData = {
      $push: {
        dataStreams: dataStreamData,
      },
    };

    Sensor.updateOne({_id: event.sensorId}, sensorData, (err) => {
      if (err) {
        this.logError(event);
      }
    });
  }

  async processDataStreamDeleted(event: DatastreamDeleted): Promise<void> {
    const sensorData = {
      $pull: {
        dataStreams: {
          dataStreamId: event.dataStreamId,
        },
      },
    };

    Sensor.updateOne({_id: event.sensorId}, sensorData, (err) => {
      if (err) {
        this.logError(event);
      }
    });
  }

  async processLocationUpdated(event: SensorRelocated): Promise<void> {
    const sensorData = {
      location: {},
    };
    sensorData.location = {
      x: event.x,
      y: event.y,
      z: event.z,
      epsgCode: event.epsgCode,
    };

    if (event.baseObjectId) {
      sensorData.location = {...sensorData.location, baseObjectId: event.baseObjectId};
    }

    Sensor.updateOne({_id: event.sensorId}, sensorData, (err) => {
      if (err) {
        this.logError(event);
      }
    });
  }

  private logError(event) {
    Logger.error(`Error while updating projection for ${event.eventType}.`);
  }

}
