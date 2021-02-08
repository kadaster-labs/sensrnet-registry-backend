import { OrganizationEvent } from '../../organization.event';

export class OrganizationDeleted extends OrganizationEvent {
  static version = '1';

  constructor(organizationId: string) {
    super(organizationId, OrganizationDeleted.version);
  }
}
