import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from 'src/command/repositories/user.service';
import { UserQueryService } from 'src/commons/user/user.qry-service';
import { UserRole } from '../../../../commons/user/user.schema';
import { UpdateUserRoleCommand } from '../../../model/user/update-user-role.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { validateLegalEntity } from '../../util/legal-entity.utils';

@CommandHandler(UpdateUserRoleCommand)
export class UpdateUserRoleCommandHandler implements ICommandHandler<UpdateUserRoleCommand> {

  constructor(
    private readonly legalEntityRepository: LegalEntityRepository,
    private readonly userQryService: UserQueryService,
    private readonly userService: UserService,
  ) { }

  async execute(command: UpdateUserRoleCommand): Promise<void> {
    if (command.legalEntityId && command.id && (command.role === UserRole.USER || command.role === UserRole.ADMIN)) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);

      await this.userQryService.retrieveUserPermissions(command.id).then(async (userPermissions) => {
        if (userPermissions.legalEntityId === command.legalEntityId) {
          if (command.role === UserRole.USER && userPermissions.role === UserRole.ADMIN) {
            await this.userService.revokeAdminPermissionForOrganization(command.id, command.legalEntityId);
          }
          else if (command.role === UserRole.ADMIN && userPermissions.role === UserRole.USER) {
            await this.userService.grantAdminPermissionForOrganization(command.id, command.legalEntityId);
          }
        }
      });

    }

    // const user = await this.userPermissionsModel.findOne({ _id: command.id });
    // if (user.legalEntityId === command.legalEntityId) {
    //   const userPermissions = { _id: command.id, legalEntityId: command.legalEntityId, role: command.role };
    //   await this.userPermissionsModel.updateOne({ _id: command.id }, userPermissions, { new: true, upsert: true });
    // }
  }

}
