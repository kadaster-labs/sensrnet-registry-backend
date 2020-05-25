import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class SensorDeactivated extends Event {
  constructor(aggregatedId: string, date: string) {
    super(`sensor-${aggregatedId}`, EventType.Deactivated, {
      date
    });
  }
}
