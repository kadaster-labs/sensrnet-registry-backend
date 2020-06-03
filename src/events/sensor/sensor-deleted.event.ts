import {SensorEvent} from './sensor.event';

export class SensorDeleted extends SensorEvent {
  constructor(sensorId: string) {
    super(sensorId);
  }
}
