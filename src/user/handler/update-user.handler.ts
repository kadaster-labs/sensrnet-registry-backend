import { UserService } from '../user.service';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../command/update-user.command';
import { validateLegalEntity } from '../../command/handler/util/legal-entity.utils';
import { LegalEntityRepository } from '../../core/repositories/legal-entity.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {

  constructor(
      private readonly usersService: UserService,
      private readonly legalEntityRepository: LegalEntityRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    if (command.legalEntityId) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
    }

    const updateFields = {
      legalEntityId: command.legalEntityId,
    } as Record<string, any>;
    if (command.password) {
      updateFields.password = command.password;
    }

    await this.usersService.updateOne(command.email, updateFields);
  }
}
