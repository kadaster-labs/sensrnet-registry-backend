import {OwnerEvent} from './owner.event';

export class OwnerUpdated extends OwnerEvent {

  public readonly ssoId: string;
  public readonly email: string;
  public readonly publicName: string;
  public readonly name: string;
  public readonly companyName: string;
  public readonly website: string;

  constructor(ownerId: string, ssoId: string, email: string, publicName: string,
              name: string, companyName: string, website: string) {
    super(ownerId);
    this.ssoId = ssoId;
    this.email = email;
    this.publicName = publicName;
    this.name = name;
    this.companyName = companyName;
    this.website = website;
  }
}
