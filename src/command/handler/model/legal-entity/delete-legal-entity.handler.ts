import { UnknowObjectException } from '../../error/unknow-object-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { DeleteLegalEntityCommand } from '../../../command/legal-entity/delete-legal-entity.command';

@CommandHandler(DeleteLegalEntityCommand)
export class DeleteLegalEntityCommandHandler implements ICommandHandler<DeleteLegalEntityCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: LegalEntityRepository,
  ) {}

  async execute(command: DeleteLegalEntityCommand): Promise<void> {
    let aggregate = await this.repository.get(command.id);
    if (aggregate) {
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.remove();
      aggregate.commit();
    } else {
      throw new UnknowObjectException(command.id);
    }
  }
}
