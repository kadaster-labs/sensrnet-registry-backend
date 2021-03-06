import { LegalEntityEvent } from '../legalentity.event';

export class OrganizationRemoved extends LegalEntityEvent {
  static version = '1';

  constructor(legalEntityId: string) {
    super(legalEntityId, OrganizationRemoved.version);
  }

}
