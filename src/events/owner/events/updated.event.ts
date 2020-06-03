import { Event } from '../../../event-store/event';

export class OwnerUpdated extends Event {

  constructor(aggregatedId: string, ssoId: string, email: string, publicName: string,
              name: string, companyName: string, website: string) {
    super(`owner-${aggregatedId}`, OwnerUpdated.name, {
      ownerId: aggregatedId,
      ssoId,
      email,
      publicName,
      name,
      companyName,
      website,
    });
  }
}
