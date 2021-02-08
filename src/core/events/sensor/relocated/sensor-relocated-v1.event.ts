import { SensorEvent } from '../sensor.event';

export class SensorRelocated extends SensorEvent {
  static version = '1';

  readonly longitude: number;
  readonly latitude: number;
  readonly height: number;
  readonly baseObjectId: string;

  constructor(sensorId: string, longitude: number, latitude: number, height: number, baseObjectId: string) {
    super(sensorId, SensorRelocated.version);
    this.longitude = longitude;
    this.latitude = latitude;
    this.height = height;
    this.baseObjectId = baseObjectId;
  }
}
