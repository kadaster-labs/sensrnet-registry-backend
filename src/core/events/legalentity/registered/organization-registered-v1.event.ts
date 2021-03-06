import { LegalEntityEvent } from '../legalentity.event';

export class OrganizationRegistered extends LegalEntityEvent {
  static version = '1';

  public readonly name: string;
  public readonly website: string;

  constructor(legalEntityId: string, website: string) {
    super(legalEntityId, OrganizationRegistered.version);
    this.website = website;
  }

}
