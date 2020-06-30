import { DeleteUserCommand } from './delete.command';
import { UserRepository } from '../repositories/user.repository';
import { UnknowUserException } from '../errors/unknow-user-exception';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: UserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userAggregate = await this.repository.get(command.email);

    if (!userAggregate) {
      throw new UnknowUserException(command.email);
    }

    const aggregate = this.publisher.mergeObjectContext(userAggregate);
    aggregate.delete();
    aggregate.commit();
  }
}
