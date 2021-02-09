import { Event } from '../../../event-store/event';

export abstract class OrganizationEvent extends Event {

  protected constructor(organizationId: string, version: string) {
    super(organizationId, version);
  }

  streamRoot(): string {
    return 'organization';
  }
}
