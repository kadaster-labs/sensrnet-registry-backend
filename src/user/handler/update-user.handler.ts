import { UserService } from '../user.service';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../command/update-user.command';
import { validateOwner } from '../../command/handler/util/owner.utils';
import { OwnerRepository } from '../../core/repositories/owner.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {

  constructor(
      private readonly usersService: UserService,
      private readonly ownerRepository: OwnerRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    await validateOwner(this.ownerRepository, command.ownerId);
    await this.usersService.updateOne(command.userId, {ownerId: command.ownerId, password: command.password});
  }
}
