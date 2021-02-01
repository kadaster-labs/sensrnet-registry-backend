import { SensorEvent } from '../../sensor.event';

export class SensorDeleted extends SensorEvent {
  static version = '1.0.0';

  constructor(sensorId: string) {
    super(sensorId, SensorDeleted.version);
  }
}
