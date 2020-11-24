import { SensorEvent } from './sensor.event';

export class SensorRelocated extends SensorEvent {
  readonly longitude: number;
  readonly latitude: number;
  readonly height: number;
  readonly baseObjectId: string;

  constructor(sensorId: string, longitude: number, latitude: number, height: number, baseObjectId: string) {
    super(sensorId);
    this.longitude = longitude;
    this.latitude = latitude;
    this.height = height;
    this.baseObjectId = baseObjectId;
  }

}
