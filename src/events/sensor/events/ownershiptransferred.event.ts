import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class SensorOwnershipTransferred extends Event {
  constructor(aggregatedId: string, date: string, oldOwnerId: string, newOwnerId: string) {
    super(`sensor-${aggregatedId}`, EventType.OwnershipTransferred, {
      date,
      oldOwnerId,
      newOwnerId
    });
  }
}
