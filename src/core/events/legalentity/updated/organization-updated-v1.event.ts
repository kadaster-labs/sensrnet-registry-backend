import { LegalEntityEvent } from '../legalentity.event';

export class OrganizationUpdated extends LegalEntityEvent {
  static version = '1';

  public readonly name: string;
  public readonly website: string;

  constructor(legalEntityId: string, website: string) {
    super(legalEntityId, OrganizationUpdated.version);
    this.website = website;
  }

}
