import { LegalEntityEvent } from '../legal-entity.event';
import { ContactDetailsBody } from '../../../../command/controller/model/contact-details/contact-details.body';

export class LegalEntityRegistered extends LegalEntityEvent {
  static version = '1';

  public readonly name: string;
  public readonly website: string;
  public readonly contactDetails: ContactDetailsBody;

  constructor(legalEntityId: string, name: string, website: string, contactDetails: ContactDetailsBody) {
    super(legalEntityId, LegalEntityRegistered.version);
    this.name = name;
    this.website = website;
    this.contactDetails = contactDetails;
  }
}
