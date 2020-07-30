import { OwnerEvent } from './owner.event';

export class OwnerUpdated extends OwnerEvent {

  public readonly organisationName: string;
  public readonly website: string;
  public readonly contactName: string;
  public readonly contactEmail: string;
  public readonly contactPhone: string;

  constructor(ownerId: string, organisationName: string, website: string,
              contactName: string, contactEmail: string, contactPhone: string) {
    super(ownerId);
    this.organisationName = organisationName;
    this.website = website;
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
  }
}
