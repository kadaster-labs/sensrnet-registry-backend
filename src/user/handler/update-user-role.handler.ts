import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUserPermissions, UserRole } from '../model/user.model';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateUserRoleCommand } from '../command/update-user-role.command';
import { validateLegalEntity } from '../../command/handler/util/legal-entity.utils';
import { LegalEntityRepository } from '../../core/repositories/legal-entity.repository';

@CommandHandler(UpdateUserRoleCommand)
export class UpdateUserRoleCommandHandler implements ICommandHandler<UpdateUserRoleCommand> {

  constructor(
      private readonly legalEntityRepository: LegalEntityRepository,
      @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
  ) {}

  async execute(command: UpdateUserRoleCommand): Promise<void> {
    if (command.legalEntityId && command.id && (command.role === UserRole.USER || command.role === UserRole.ADMIN)) {
      await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);

      const user = await this.userPermissionsModel.findOne({_id: command.id});
      if (user.legalEntityId === command.legalEntityId) {
        const userPermissions = {_id: command.id, legalEntityId: command.legalEntityId, role: command.role};
        await this.userPermissionsModel.updateOne({_id: command.id}, userPermissions, {new: true, upsert: true});
      }
    }
  }
}
