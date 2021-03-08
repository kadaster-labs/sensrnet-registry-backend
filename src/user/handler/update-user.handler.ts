import { UserService } from '../user.service';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../command/update-user.command';
import { validateOrganization } from '../../command/handler/util/organization.utils';
import { OrganizationRepository } from '../../core/repositories/organization.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {

  constructor(
      private readonly usersService: UserService,
      private readonly ownerRepository: OrganizationRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    if (command.organization) {
      await validateOrganization(this.ownerRepository, command.organization);
    }

    let updateFields = {};
    updateFields = {organizationId: command.organization, ...updateFields};
    if (command.password) {
      updateFields = {password: command.password, ...updateFields};
    }

    await this.usersService.updateOne(command.id, updateFields);
  }
}
