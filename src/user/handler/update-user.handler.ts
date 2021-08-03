import { UserService } from '../user.service';
import { UserRole } from '../schema/user-permissions.schema';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../command/update-user.command';
import { validateLegalEntity } from '../../command/handler/util/legal-entity.utils';
import { LegalEntityRepository } from '../../core/repositories/legal-entity.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {

  constructor(
    private readonly usersService: UserService,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) { }

  async execute(command: UpdateUserCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);

      const userPermissions = { _id: command.id, legalEntityId: command.legalEntityId, role: UserRole.USER };
      await this.usersService.updateUserPermissions({ _id: command.id }, userPermissions);
    } else if (command.leaveLegalEntity) {
      await this.usersService.deleteUserPermissions({ _id: command.id });
    }
  }
}
