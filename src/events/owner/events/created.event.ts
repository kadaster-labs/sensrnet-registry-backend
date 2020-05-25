import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class OwnerCreated extends Event {
  constructor(aggregatedId: string, date: string, nodeId: string, ssoId: string, email: string, publicName: string, 
    name: string, companyName: string, website: string) {
    super(`owner-${aggregatedId}`, EventType.Created, {
      date,
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
