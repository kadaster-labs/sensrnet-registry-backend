import {SensorEvent} from './sensor.event';

export class SensorRelocated extends SensorEvent {

  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly epsgCode: number;
  readonly baseObjectId: string;

  constructor(sensorId: string, x: number, y: number, z: number, epsgCode: number,
              baseObjectId: string) {
    super(sensorId);
    this.x = x;
    this.y = y;
    this.z = z;
    this.epsgCode = epsgCode;
    this.baseObjectId = baseObjectId;
  }

}
