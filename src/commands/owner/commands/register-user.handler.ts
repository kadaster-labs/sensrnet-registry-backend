import { UserAggregate } from '../aggregates/user.aggregate';
import { RegisterUserCommand } from './register-user.command';
import { UserRepository } from '../repositories/user.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { UserAlreadyExistsException } from '../errors/user-already-exists-exception';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: UserRepository,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    let aggregate: UserAggregate;
    aggregate = await this.repository.get(command.email);

    if (!!aggregate) {
      throw new UserAlreadyExistsException(command.email);
    } else {
      const userAggregate = new UserAggregate(command.email);
      aggregate = this.publisher.mergeObjectContext(userAggregate);

      aggregate.register(command.ownerId, command.password);
      aggregate.commit();
    }
  }
}
