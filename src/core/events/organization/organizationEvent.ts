import { Event } from '../../../event-store/event';

export abstract class OrganizationEvent extends Event {

  protected constructor(organizationId: string) {
    super(organizationId);
  }

  streamRoot(): string {
    return 'organization';
  }
}
