import { SensorEvent } from '../../sensor.event';

export class SensorRelocated extends SensorEvent {
  static version = '1.0.1';

  readonly location: number[];
  readonly baseObjectId: string;

  constructor(sensorId: string, location: number[], baseObjectId: string) {
    super(sensorId, SensorRelocated.version);
    this.location = location;
    this.baseObjectId = baseObjectId;
  }
}
