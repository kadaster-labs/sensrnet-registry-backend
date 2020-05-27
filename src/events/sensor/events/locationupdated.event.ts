import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class SensorLocationUpdated extends Event {
  constructor(aggregatedId: string, x: number, y: number, z: number, epsgCode: number, 
    baseObjectId: string) {
    super(`sensor-${aggregatedId}`, EventType.LocationUpdated, {
      x,
      y,
      z,
      epsgCode,
      baseObjectId
    });
  }
}
