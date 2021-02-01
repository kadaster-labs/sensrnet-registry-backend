import { OrganizationEvent } from '../../organization.event';

export class OrganizationUpdated extends OrganizationEvent {
  static version = '1.0.0';

  public readonly website: string;
  public readonly contactName: string;
  public readonly contactEmail: string;
  public readonly contactPhone: string;

  constructor(organizationId: string, website: string, contactName: string, contactEmail: string, contactPhone: string) {
    super(organizationId, OrganizationUpdated.version);
    this.website = website;
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
  }
}
