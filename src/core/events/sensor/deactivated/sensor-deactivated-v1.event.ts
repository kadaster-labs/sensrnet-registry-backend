import { SensorEvent } from '../sensor.event';

export class SensorDeactivated extends SensorEvent {
  static version = '1';

  constructor(sensorId: string) {
    super(sensorId, SensorDeactivated.version);
  }
}
