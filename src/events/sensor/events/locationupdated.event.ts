import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class SensorLocationUpdated extends Event {
  constructor(aggregatedId: string, lon: number, lat: number, height: number, 
    baseObjectId: string) {
    super(`sensor-${aggregatedId}`, EventType.LocationUpdated, {
      lon,
      lat,
      height,
      baseObjectId
    });
  }
}