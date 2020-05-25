import { EventType } from "./event-type";
import { Event } from "../../event-store/event";


export class DataStreamDeleted extends Event {
  constructor(aggregatedId: string, date: string, name: string) {
    super(`sensor-${aggregatedId}`, EventType.DataStreamDeleted, {
      date,
      name
    });
  }
}
