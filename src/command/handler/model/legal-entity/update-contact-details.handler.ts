import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { UpdateContactDetailsCommand } from '../../../command/legal-entity/update-contact-details.command copy';
import { UnknowObjectException } from '../../error/unknow-object-exception';

@CommandHandler(UpdateContactDetailsCommand)
export class UpdateContactDetailsCommandHandler implements ICommandHandler<UpdateContactDetailsCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: LegalEntityRepository,
  ) { }

  async execute(command: UpdateContactDetailsCommand): Promise<void> {
    let aggregate = await this.repository.get(command.legalEntityId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.updateContactDetails(command.contactDetailsId, command.name, command.email, command.phone);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.legalEntityId);
    }
  }

}
