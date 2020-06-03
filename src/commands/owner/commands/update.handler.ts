import { UpdateOwnerCommand } from './update.command';
import { OwnerRepository } from '../repositories/owner.repository';
import { UnknowOwnerException } from '../errors/unknow-owner-exception';
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
    aggregate.update(command.ssoId, command.email, command.publicName,
      command.name, command.companyName, command.website);
    aggregate.commit();
  }
}
