import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { UpdateLegalEntityCommand } from '../../../command/legal-entity/update-legal-entity.command';

@CommandHandler(UpdateLegalEntityCommand)
export class UpdateLegalEntityCommandHandler implements ICommandHandler<UpdateLegalEntityCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: LegalEntityRepository,
  ) {}

  async execute(command: UpdateLegalEntityCommand): Promise<void> {
    let aggregate = await this.repository.get(command.legalEntityId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.update(command.name, command.website, command.contactDetails);
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.legalEntityId);
    }
  }
}
