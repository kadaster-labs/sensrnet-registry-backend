import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validateLegalEntity } from '../../command/handler/util/legal-entity.utils';
import { LegalEntityRepository } from '../../core/repositories/legal-entity.repository';
import { LeaveLegalEntityCommand } from '../command/leave-legal-entity.command';
import { LastAdminCannotLeaveOrganization } from '../errors/last-admin-cannot-leave-organization';
import { IUserPermissions, UserRole } from '../model/user.model';
import { UserService } from '../user.service';

@CommandHandler(LeaveLegalEntityCommand)
export class LeaveLegalEntityCommandHandler implements ICommandHandler<LeaveLegalEntityCommand> {

  protected logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly usersService: UserService,
    private readonly legalEntityRepository: LegalEntityRepository,
    @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
  ) { }

  async execute(command: LeaveLegalEntityCommand): Promise<void> {
    await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);

    if (await this.isUserNotAdmin(command.userId)) {
      this.usersService.revokeUserPermissionForOrganization(command.userId, command.legalEntityId);
    }
    else if (this.isUserLastAdmin(command.legalEntityId)) {
      throw new LastAdminCannotLeaveOrganization();
    }
    else {
      this.usersService.revokeUserPermissionForOrganization(command.userId, command.legalEntityId);
    }
  }

  private async isUserNotAdmin(userId: string): Promise<boolean> {
    const permissions = await this.usersService.retrieveUserPermissions(userId);
    const isUser = permissions.role === UserRole.USER
    this.logger.debug(`checking for NOT admin role: [${isUser}] (permissions: [${JSON.stringify(permissions)}])`);
    return isUser;
  }

  private async isUserLastAdmin(legalEntityId: string): Promise<boolean> {
    const admins = await this.userPermissionsModel.find({ legalEntityId: legalEntityId, role: UserRole.ADMIN });
    this.logger.debug(`[${admins.length}] of admins in organization [${legalEntityId}]`);
    return admins.length == 1;
  }

}
