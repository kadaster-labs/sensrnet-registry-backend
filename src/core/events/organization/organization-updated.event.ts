import { OrganizationEvent } from './organizationEvent';

export class OrganizationUpdated extends OrganizationEvent {
  public readonly website: string;
  public readonly contactName: string;
  public readonly contactEmail: string;
  public readonly contactPhone: string;

  constructor(organizationId: string, website: string, contactName: string, contactEmail: string, contactPhone: string) {
    super(organizationId);
    this.website = website;
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
  }
}
