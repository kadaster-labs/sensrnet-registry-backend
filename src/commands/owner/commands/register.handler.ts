import { RegisterOwnerCommand as RegisterOwnerCommand } from './register.command';
import { OwnerAggregate } from '../aggregates/owner.aggregate';
import { OwnerRepository } from '../repositories/owner.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { OwnerAlreadyExistsException } from '../errors/owner-already-exists-exception';

@CommandHandler(RegisterOwnerCommand)
export class RegisterOwnerCommandHandler implements ICommandHandler<RegisterOwnerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: OwnerRepository,
  ) {}

  async execute(command: RegisterOwnerCommand): Promise<void> {
    let aggregate: OwnerAggregate;
    aggregate = await this.repository.get(command.ownerId);

    if (!!aggregate) {
      throw new OwnerAlreadyExistsException(command.ownerId);
    } else {
      const ownerAggregate = new OwnerAggregate(command.ownerId);
      aggregate = this.publisher.mergeObjectContext(ownerAggregate);

      aggregate.register(command.nodeId, command.ssoId, command.email, command.publicName,
        command.name, command.companyName, command.website);
      aggregate.commit();
    }
  }
}
