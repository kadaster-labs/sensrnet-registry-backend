import { Event } from "../../../event-store/event";

export class SensorRelocated extends Event {
  constructor(aggregatedId: string, x: number, y: number, z: number, epsgCode: number,
    baseObjectId: string) {
    super(`sensor-${aggregatedId}`, SensorRelocated.name, {
      sensorId: aggregatedId,
      x,
      y,
      z,
      epsgCode,
      baseObjectId
    });
  }
}
