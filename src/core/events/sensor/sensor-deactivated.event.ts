import { SensorEvent } from './sensor.event';

export class SensorDeactivated extends SensorEvent {
  constructor(sensorId: string) {
    super(sensorId);
  }
}
