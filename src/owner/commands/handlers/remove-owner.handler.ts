import { Logger } from '@nestjs/common';
import { RemoveOwnerCommand } from '../impl/remove-owner.command';
import { OwnerRepository } from '../../repository/owner.repository';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';


@CommandHandler(RemoveOwnerCommand)
export class RemoveOwnerHandler
  implements ICommandHandler<RemoveOwnerCommand> {
  constructor(
    private readonly repository: OwnerRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveOwnerCommand, resolve: (value?) => void) {
    Logger.log('Async RemoveOwnerHandler...', 'RemoveOwnerCommand');
    const {dto} = command;
    const owner = this.publisher.mergeObjectContext(
      await this.repository.removeOwner(dto),
    );

    owner.commit();
    resolve();
  }
}
