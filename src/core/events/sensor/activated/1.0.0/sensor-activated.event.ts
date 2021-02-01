import { SensorEvent } from '../../sensor.event';

export class SensorActivated extends SensorEvent {
  static version = '1.0.0';

  constructor(sensorId: string) {
    super(sensorId, SensorActivated.version);
  }
}
