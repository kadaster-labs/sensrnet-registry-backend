import { Logger } from '@nestjs/common';
import { UpdateOwnerCommand } from '../impl/update-owner.command';
import { OwnerRepository } from '../../repository/owner.repository';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';


@CommandHandler(UpdateOwnerCommand)
export class UpdateOwnerHandler
  implements ICommandHandler<UpdateOwnerCommand> {
  constructor(
    private readonly repository: OwnerRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateOwnerCommand, resolve: (value?) => void) {
    Logger.log('Async UpdateOwnerHandler...', 'UpdateOwnerCommand');
    
    const {dto} = command;
    const owner = this.publisher.mergeObjectContext(
      await this.repository.updateOwner(dto),
    );

    owner.commit();
    resolve();
  }
}
