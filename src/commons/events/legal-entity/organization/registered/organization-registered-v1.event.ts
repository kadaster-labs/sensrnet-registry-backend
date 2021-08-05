import { LegalEntityEvent } from '../../legal-entity.event';

export class OrganizationRegistered extends LegalEntityEvent {
  static version = '1';

  public readonly name: string;
  public readonly userId: string;
  public readonly website: string;

  constructor(legalEntityId: string, userId: string, name: string, website: string) {
    super(legalEntityId, OrganizationRegistered.version);
    this.name = name;
    this.userId = userId;
    this.website = website;
  }
}
