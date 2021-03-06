import { AbstractEventType } from '../abstract-event-type';
import { DeviceUpdated, getDeviceUpdatedEvent } from './device';
import { DeviceRemoved, getDeviceRemovedEvent } from './device';
import { DeviceRegistered, getDeviceRegisteredEvent } from './device';
import { DeviceLocated, getDeviceLocatedEvent } from './device';
import { DeviceRelocated, getDeviceRelocatedEvent } from './device';
import { DatastreamAdded, getDatastreamAddedEvent } from './datastream';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from './datastream';
import { DatastreamRemoved, getDatastreamRemovedEvent } from './datastream';
import { getObservationGoalAddedEvent, ObservationGoalAdded } from '../observationgoal/added';
import { getObservationGoalUpdatedEvent, ObservationGoalUpdated } from '../observationgoal/updated';
import { getObservationGoalRemovedEvent, ObservationGoalRemoved } from '../observationgoal/removed';
import { getSensorAddedEvent, SensorAdded } from './sensor';
import { getSensorUpdatedEvent, SensorUpdated } from './sensor';
import { getSensorRemovedEvent, SensorRemoved } from './sensor';

class DeviceEventType extends AbstractEventType {
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

    this.add(ObservationGoalAdded, getObservationGoalAddedEvent);
    this.add(ObservationGoalUpdated, getObservationGoalUpdatedEvent);
    this.add(ObservationGoalRemoved, getObservationGoalRemovedEvent);
  }
}

export const sensorDeviceEventType = new DeviceEventType();
