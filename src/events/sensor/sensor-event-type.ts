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
} from './index';
import {Logger} from '@nestjs/common';

class SensorEventType {
  constructor() {
    this.add(SensorRegistered);
    this.add(SensorUpdated);
    this.add(SensorDeleted);
    this.add(SensorActivated);
    this.add(SensorDeactivated);
    this.add(SensorRelocated);
    this.add(SensorOwnershipShared);
    this.add(SensorOwnershipTransferred);
    this.add(DatastreamAdded);
    this.add(DatastreamDeleted);
  }

  private supportedTypes: { [key: string]: any; } = {};

  getType(eventTypeName: string) {
    const t = this.supportedTypes[eventTypeName];
    if (!t) {
      Logger.warn(`Unsupported event received! eventType: ${eventTypeName}`);
    }
    return t;
  }

  private add(event: any) {
    this.supportedTypes[event.name] = event;
  }

}

export const eventType = new SensorEventType();
