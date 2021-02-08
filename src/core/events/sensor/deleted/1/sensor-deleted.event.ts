import { SensorEvent } from '../../sensor.event';

export class SensorDeleted extends SensorEvent {
  static version = '1';

  constructor(sensorId: string) {
    super(sensorId, SensorDeleted.version);
  }
}
