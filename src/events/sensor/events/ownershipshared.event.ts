import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class SensorOwnershipShared extends Event {
  constructor(aggregatedId: string, ownerId: string) {
    super(`sensor-${aggregatedId}`, EventType.OwnershipShared, {
      ownerId
    });
  }
}
