import { Event } from "../../../event-store/event";

export class OwnerRegistered extends Event {

  constructor(aggregatedId: string, nodeId: string, ssoId: string, email: string, publicName: string,
    name: string, companyName: string, website: string) {
    super(`owner-${aggregatedId}`, OwnerRegistered.name, {
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
