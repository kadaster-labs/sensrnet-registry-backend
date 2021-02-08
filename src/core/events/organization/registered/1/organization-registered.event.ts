import { OrganizationEvent } from '../../organization.event';

export class OrganizationRegistered extends OrganizationEvent {
  static version = '1';

  public readonly website: string;
  public readonly contactName: string;
  public readonly contactEmail: string;
  public readonly contactPhone: string;

  constructor(organizationId: string, website: string, contactName: string, contactEmail: string, contactPhone: string) {
    super(organizationId, OrganizationRegistered.version);
    this.website = website;
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
  }
}
