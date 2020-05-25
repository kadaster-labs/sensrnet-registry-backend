import { EventType } from "./event-type";
import { Event } from "../../event-store/event";


export class SensorDeleted extends Event {
  constructor(aggregatedId: string, date: string) {
    super(`sensor-${aggregatedId}`, EventType.Deleted, {
      date
    });
  }
}
