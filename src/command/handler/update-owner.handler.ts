import { UpdateOwnerCommand } from '../model/update-owner.command';
import { UnknowOwnerException } from './error/unknow-owner-exception';
import { OwnerRepository } from '../../core/repositories/owner.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateOwnerCommand)
export class UpdateOwnerCommandHandler
  implements ICommandHandler<UpdateOwnerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: OwnerRepository,
  ) {}

  async execute(command: UpdateOwnerCommand): Promise<void> {
    const ownerAggregate = await this.repository.get(command.ownerId);

    if (!ownerAggregate) {
      throw new UnknowOwnerException(command.ownerId);
    }

    const aggregate = this.publisher.mergeObjectContext(ownerAggregate);
    aggregate.update(command.organisationName, command.website,
      command.contactName, command.contactEmail, command.contactPhone);
    aggregate.commit();
  }
}
