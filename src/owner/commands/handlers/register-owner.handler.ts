import { Logger } from '@nestjs/common';
import { RegisterCommand } from '../impl/register-owner.command';
import { OwnerRepository } from '../../repository/owner.repository';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';


@CommandHandler(RegisterCommand)
export class RegisterOwnerHandler
  implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly repository: OwnerRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RegisterCommand, resolve: (value?) => void) {
    Logger.log('Async RegisterOwnerHandler...', 'RegisterOwnerCommand');

    const {dto: registerOwnerDto} = command;
    const owner = this.publisher.mergeObjectContext(
      await this.repository.registerOwner(registerOwnerDto),
    );

    owner.commit();
    resolve(registerOwnerDto);
  }
}
