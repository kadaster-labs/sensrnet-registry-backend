import { EventType } from "./event-type";
import { Event } from "../../event-store/event";


export class Created extends Event {
  constructor(aggregatedId: string, nodeId: string, ssoId: string, email: string, publicName: string, 
    name: string, companyName: string, website: string) {
    super(`owner-${aggregatedId}`, EventType.Created, {
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
