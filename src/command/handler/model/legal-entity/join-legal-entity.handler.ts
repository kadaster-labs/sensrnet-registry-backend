import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JoinLegalEntityCommand } from '../../../model/user/join-legal-entity.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { UserService } from '../../../repositories/user.service';
import { validateLegalEntity } from '../../util/legal-entity.utils';

@CommandHandler(JoinLegalEntityCommand)
export class JoinLegalEntityCommandHandler implements ICommandHandler<JoinLegalEntityCommand> {
    constructor(
        private readonly usersService: UserService,
        private readonly legalEntityRepository: LegalEntityRepository,
    ) {}

    async execute(command: JoinLegalEntityCommand): Promise<void> {
        await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);

        if (await this.usersService.hasAdmins(command.legalEntityId)) {
            await this.usersService.grantUserPermissionForOrganization(command.userId, command.legalEntityId);
        } else {
            await this.usersService.grantAdminPermissionForOrganization(command.userId, command.legalEntityId);
        }
    }
}
