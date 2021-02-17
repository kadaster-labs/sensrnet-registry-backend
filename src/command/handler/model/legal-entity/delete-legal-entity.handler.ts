import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { DeleteLegalEntityCommand } from '../../../command/legal-entity/delete-legal-entity.command';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';

@CommandHandler(DeleteLegalEntityCommand)
export class DeleteLegalEntityCommandHandler implements ICommandHandler<DeleteLegalEntityCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: LegalEntityRepository,
  ) {}

  async execute(command: DeleteLegalEntityCommand): Promise<void> {
    let aggregate = await this.repository.get(command.legalEntityId);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.delete();
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.legalEntityId);
    }
  }
}
