import { AbstractEventType } from '../abstract-event-type';
import { DatastreamAdded, getDatastreamAddedEvent } from './datastream/added';
import { getObservationGoalLinkedEvent, ObservationGoalLinked } from './datastream/observation-goal-linked';
import { getObservationGoalUnlinkedEvent, ObservationGoalUnlinked } from './datastream/observation-goal-unlinked';
import { DatastreamRemoved, getDatastreamRemovedEvent } from './datastream/removed';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from './datastream/updated';
import { DeviceLocated, getDeviceLocatedEvent } from './device/located';
import { DeviceRegistered, getDeviceRegisteredEvent } from './device/registered';
import { DeviceRelocated, getDeviceRelocatedEvent } from './device/relocated';
import { DeviceRemoved, getDeviceRemovedEvent } from './device/removed';
import { DeviceUpdated, getDeviceUpdatedEvent } from './device/updated';
import { getSensorAddedEvent, SensorAdded } from './sensor/added';
import { getSensorRemovedEvent, SensorRemoved } from './sensor/removed';
import { getSensorUpdatedEvent, SensorUpdated } from './sensor/updated';

class SensorDeviceEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(DeviceRegistered, getDeviceRegisteredEvent);
    this.add(DeviceUpdated, getDeviceUpdatedEvent);
    this.add(DeviceRemoved, getDeviceRemovedEvent);
    this.add(DeviceLocated, getDeviceLocatedEvent);
    this.add(DeviceRelocated, getDeviceRelocatedEvent);

    this.add(SensorAdded, getSensorAddedEvent);
    this.add(SensorUpdated, getSensorUpdatedEvent);
    this.add(SensorRemoved, getSensorRemovedEvent);

    this.add(DatastreamAdded, getDatastreamAddedEvent);
    this.add(DatastreamUpdated, getDatastreamUpdatedEvent);
    this.add(DatastreamRemoved, getDatastreamRemovedEvent);

    this.add(ObservationGoalLinked, getObservationGoalLinkedEvent);
    this.add(ObservationGoalUnlinked, getObservationGoalUnlinkedEvent);
  }
}

export const sensorDeviceEventType = new SensorDeviceEventType();
