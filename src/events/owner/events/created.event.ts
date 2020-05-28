import { Event } from "../../../event-store/event";

export class OwnerCreated extends Event {

  constructor(aggregatedId: string, nodeId: string, ssoId: string, email: string, publicName: string,
    name: string, companyName: string, website: string) {
    super(`owner-${aggregatedId}`, OwnerCreated.name, {
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
