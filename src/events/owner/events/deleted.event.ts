import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class OwnerDeleted extends Event {
  constructor(aggregatedId: string, date: string) {
    super(`owner-${aggregatedId}`, EventType.Deleted, {
      date
    });
  }
}
