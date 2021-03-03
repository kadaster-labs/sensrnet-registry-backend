import { LegalEntityEvent } from '../legal-entity.event';
import { ContactDetailsBody } from '../../../../command/controller/model/contact-details/contact-details.body';

export class LegalEntityUpdated extends LegalEntityEvent {
  static version = '1';

  public readonly website: string;
  public readonly contactDetails: ContactDetailsBody;

  constructor(legalEntityId: string, website: string, contactDetails: ContactDetailsBody) {
    super(legalEntityId, LegalEntityUpdated.version);
    this.website = website;
    this.contactDetails = contactDetails;
  }
}
