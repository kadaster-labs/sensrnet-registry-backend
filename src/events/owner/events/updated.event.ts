import { EventType } from "./event-type";
import { Event } from "../../../event-store/event";


export class OwnerUpdated extends Event {
  constructor(aggregatedId: string, date: string, ssoId: string, email: string, publicName: string, 
    name: string, companyName: string, website: string) {
    super(`owner-${aggregatedId}`, EventType.Updated, {
      date,
      ssoId,
      email,
      publicName,
      name,
      companyName,
      website
    });
  }
}
