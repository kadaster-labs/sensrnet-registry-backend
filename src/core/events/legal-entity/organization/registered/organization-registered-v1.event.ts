import { LegalEntityEvent } from '../../legal-entity.event';

export class OrganizationRegistered extends LegalEntityEvent {
  static version = '1';

  public readonly name: string;
  public readonly website: string;

  constructor(legalEntityId: string, name: string, website: string) {
    super(legalEntityId, OrganizationRegistered.version);
    this.name = name;
    this.website = website;
  }
}
