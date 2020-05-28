import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class OwnerDeleted extends Event {
  static eventType = EventType.Deleted;

  constructor(aggregatedId: string) {
    super(`owner-${aggregatedId}`, OwnerDeleted.eventType, {
      ownerId: aggregatedId
    });
  }
}
