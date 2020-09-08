import { RegisterOwnerCommand } from '../model/register-owner.command';
import { OwnerAggregate } from '../../core/aggregates/owner.aggregate';
import { OwnerRepository } from '../../core/repositories/owner.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { OwnerAlreadyExistsException } from './error/owner-already-exists-exception';
import { Logger } from '@nestjs/common';

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

      aggregate.register(command.organisationName, command.website, command.name, command.contactEmail, command.contactPhone);
      aggregate.commit();
    }
  }
}
