import { EventType } from "./event-type";
import { Event } from "../../event-store/event";


export class SensorActivated extends Event {
  constructor(aggregatedId: string, date: string) {
    super(`sensor-${aggregatedId}`, EventType.Activated, {
      date
    });
  }
}
