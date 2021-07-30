import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { validateLegalEntity } from '../../command/handler/util/legal-entity.utils';
import { LegalEntityRepository } from '../../core/repositories/legal-entity.repository';
import { JoinLegalEntityCommand } from '../command/join-legal-entity.command';
import { UserService } from '../user.service';

@CommandHandler(JoinLegalEntityCommand)
export class JoinLegalEntityCommandHandler implements ICommandHandler<JoinLegalEntityCommand> {

  constructor(
    private readonly usersService: UserService,
    private readonly legalEntityRepository: LegalEntityRepository,
  ) { }

  async execute(command: JoinLegalEntityCommand): Promise<void> {
    await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);

    await this.usersService.grantUserPermissionForOrganization(command.userId, command.legalEntityId);
  }

}
