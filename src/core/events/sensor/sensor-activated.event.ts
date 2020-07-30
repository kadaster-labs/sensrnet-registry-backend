import {SensorEvent} from './sensor.event';

export class SensorActivated extends SensorEvent {
  constructor(sensorId: string) {
    super(sensorId);
  }
}
