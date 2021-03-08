import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { DeleteContactDetailsCommand } from '../../../command/legal-entity/delete-contact-details.command';
import { UnknowObjectException } from '../../error/unknow-object-exception';

@CommandHandler(DeleteContactDetailsCommand)
export class DeleteContactDetailsCommandHandler implements ICommandHandler<DeleteContactDetailsCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: LegalEntityRepository,
  ) { }

  async execute(command: DeleteContactDetailsCommand): Promise<void> {
    let aggregate = await this.repository.get(command.legalEntityId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.removeContactDetails(command.contactDetailsId);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.legalEntityId);
    }
  }

}
