import { AbstractEventType } from '../abstract-event-type';
import { DeviceUpdated, getDeviceUpdatedEvent } from './updated';
import { DeviceDeleted, getDeviceDeletedEvent } from './deleted';
import { DeviceRegistered, getDeviceRegisteredEvent } from './registered';

class DeviceEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(DeviceRegistered, getDeviceRegisteredEvent);
    this.add(DeviceUpdated, getDeviceUpdatedEvent);
    this.add(DeviceDeleted, getDeviceDeletedEvent);
  }
}

export const deviceEventType = new DeviceEventType();
