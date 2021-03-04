import { AbstractEventType } from '../abstract-event-type';
import { DeviceUpdated, getDeviceUpdatedEvent } from './updated';
import { DeviceRemoved, getDeviceRemovedEvent } from './removed';
import { DeviceRegistered, getDeviceRegisteredEvent } from './registered';
import { DeviceLocated, getDeviceLocatedEvent } from './located';
import { DeviceRelocated, getDeviceRelocatedEvent } from './relocated';
import { DatastreamAdded, getDatastreamAddedEvent } from '../datastream/added';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from '../datastream/updated';
import { DatastreamRemoved, getDatastreamRemovedEvent } from '../datastream/removed';
import { getObservationGoalAddedEvent, ObservationGoalAdded } from '../observation-goal/added';
import { getObservationGoalUpdatedEvent, ObservationGoalUpdated } from '../observation-goal/updated';
import { getObservationGoalRemovedEvent, ObservationGoalRemoved } from '../observation-goal/removed';
import { getSensorAddedEvent, SensorAdded } from '../sensor/added';
import { getSensorUpdatedEvent, SensorUpdated } from '../sensor/updated';
import { getSensorRemovedEvent, SensorRemoved } from '../sensor/removed';

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

export const deviceEventType = new DeviceEventType();
