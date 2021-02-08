import { SensorEvent } from '../sensor.event';

export class SensorActivated extends SensorEvent {
  static version = '1';

  constructor(sensorId: string) {
    super(sensorId, SensorActivated.version);
  }
}
