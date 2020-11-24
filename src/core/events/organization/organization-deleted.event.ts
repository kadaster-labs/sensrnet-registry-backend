import { OrganizationEvent } from './organizationEvent';

export class OrganizationDeleted extends OrganizationEvent {
  constructor(organizationId: string) {
    super(organizationId);
  }
}
