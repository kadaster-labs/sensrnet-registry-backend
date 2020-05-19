import { Logger } from '@nestjs/common';
import { OwnerRepository } from '../../repository/owner.repository';
import { RegisterOwnerCommand } from '../impl/register-owner.command';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';


@CommandHandler(RegisterOwnerCommand)
export class RegisterOwnerHandler
  implements ICommandHandler<RegisterOwnerCommand> {
  constructor(
    private readonly repository: OwnerRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RegisterOwnerCommand, resolve: (value?) => void) {
    Logger.log('Async RegisterOwnerHandler...', 'RegisterOwnerCommand');

    const {dto: registerOwnerDto} = command;
    const owner = this.publisher.mergeObjectContext(
      await this.repository.registerOwner(registerOwnerDto),
    );

    owner.commit();
    resolve();
  }
}
