import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class OwnerUpdated extends Event {
  static eventType = EventType.Updated;

  constructor(aggregatedId: string, ssoId: string, email: string, publicName: string, 
    name: string, companyName: string, website: string) {
    super(`owner-${aggregatedId}`, OwnerUpdated.eventType, {
      ownerId: aggregatedId,
      ssoId,
      email,
      publicName,
      name,
      companyName,
      website
    });
  }
}
