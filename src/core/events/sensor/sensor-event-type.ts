import { AbstractEventType } from '../abstract-event-type';
import { SensorUpdated, getSensorUpdatedEvent } from './updated';
import { SensorDeleted, getSensorDeletedEvent } from './deleted';
import { DatastreamAdded, getDatastreamAddedEvent } from './ds-added';
import { SensorRelocated, getSensorRelocatedEvent } from './relocated';
import { SensorActivated, getSensorActivatedEvent } from './activated';
import { SensorRegistered, getSensorRegisteredEvent } from './registered';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from './ds-updated';
import { DatastreamDeleted, getDatastreamDeletedEvent } from './ds-deleted';
import { SensorDeactivated, getSensorDeactivatedEvent } from './deactivated';
import { SensorOwnershipShared, getSensorOwnershipSharedEvent } from './ownership-shared';
import { SensorOwnershipTransferred, getSensorOwnershipTransferredEvent } from './ownership-transferred';

class SensorEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(SensorRegistered, getSensorRegisteredEvent);
    this.add(SensorUpdated, getSensorUpdatedEvent);
    this.add(SensorDeleted, getSensorDeletedEvent);
    this.add(SensorActivated, getSensorActivatedEvent);
    this.add(SensorDeactivated, getSensorDeactivatedEvent);
    this.add(SensorRelocated, getSensorRelocatedEvent);
    this.add(SensorOwnershipShared, getSensorOwnershipSharedEvent);
    this.add(SensorOwnershipTransferred, getSensorOwnershipTransferredEvent);
    this.add(DatastreamAdded, getDatastreamAddedEvent);
    this.add(DatastreamUpdated, getDatastreamUpdatedEvent);
    this.add(DatastreamDeleted, getDatastreamDeletedEvent);
  }
}

export const sensorEventType = new SensorEventType();
