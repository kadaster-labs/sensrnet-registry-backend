import { AlreadyExistsException } from '../../error/already-exists-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { LegalEntityAggregate } from '../../../../core/aggregates/legal-entity.aggregate';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { RegisterLegalEntityCommand } from '../../../command/legal-entity/register-legal-entity.command';

@CommandHandler(RegisterLegalEntityCommand)
export class RegisterLegalEntityCommandHandler implements ICommandHandler<RegisterLegalEntityCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: LegalEntityRepository,
  ) {}

  async execute(command: RegisterLegalEntityCommand): Promise<void> {
    let aggregate = await this.repository.get(command.legalEntityId);

    if (aggregate) {
      throw new AlreadyExistsException(command.legalEntityId);
    } else {
      aggregate = new LegalEntityAggregate(command.legalEntityId);
      aggregate = this.publisher.mergeObjectContext(aggregate);

      aggregate.register(command.name, command.website, command.contactDetails);
      aggregate.commit();
    }
  }
}
