import { ICommand } from '@nestjs/cqrs';
import { ContactDetailsBody } from '../../controller/model/contact-details/contact-details.body';

export class LegalEntityCommand implements ICommand {
  constructor(
      public readonly legalEntityId: string,
      public readonly website: string,
      public readonly contactDetails: ContactDetailsBody,
  ) {}
}
