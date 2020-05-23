import { EventType } from "./event-type";
import { Event } from "../../event-store/event";


export class Deleted extends Event {
  constructor(aggregatedId: string) {
    super(`owner-${aggregatedId}`, EventType.Deleted);
  }
}
