import { AbstractEventType } from '../abstract-event-type';
import { SensorUpdated, getSensorUpdatedEvent } from './updated';
import { SensorDeleted, getSensorDeletedEvent } from './deleted';
import { SensorRegistered, getSensorRegisteredEvent } from './registered';

class SensorEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(SensorRegistered, getSensorRegisteredEvent);
    this.add(SensorUpdated, getSensorUpdatedEvent);
    this.add(SensorDeleted, getSensorDeletedEvent);
  }
}

export const sensorEventType = new SensorEventType();
