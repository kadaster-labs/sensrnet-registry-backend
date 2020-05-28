import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class OwnerCreated extends Event {
  static eventType = EventType.Created;

  constructor(aggregatedId: string, nodeId: string, ssoId: string, email: string, publicName: string, 
    name: string, companyName: string, website: string) {
    super(`owner-${aggregatedId}`, OwnerCreated.eventType, {
      ownerId: aggregatedId,
      nodeId,
      ssoId,
      email,
      publicName,
      name,
      companyName,
      website
    });
  }
}
