import { EventType } from "./event-type";
import { Event } from "../../event-store/event";


export class Updated extends Event {
  constructor(aggregatedId: string, ssoId: string, email: string, publicName: string, 
    name: string, companyName: string, website: string) {
    super(`owner-${aggregatedId}`, EventType.Updated, {
      ssoId,
      email,
      publicName,
      name,
      companyName,
      website
    });
  }
}
