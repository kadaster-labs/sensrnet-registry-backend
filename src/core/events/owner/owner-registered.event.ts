import { OwnerEvent } from './owner.event';

export class OwnerRegistered extends OwnerEvent {

  public readonly nodeId: string;
  public readonly organisationName: string;
  public readonly website: string;
  public readonly name: string;
  public readonly contactEmail: string;
  public readonly contactPhone: string;

  constructor(ownerId: string, nodeId: string, organisationName: string, website: string,
              name: string, contactEmail: string, contactPhone: string) {
    super(ownerId);
    this.nodeId = nodeId;
    this.organisationName = organisationName;
    this.website = website;
    this.name = name;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
  }
}
