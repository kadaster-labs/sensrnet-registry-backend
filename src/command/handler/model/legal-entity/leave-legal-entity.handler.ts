import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../../../../command/repositories/user.service';
import { UserQueryService } from '../../../../commons/user/user.qry-service';
import { IUserPermissions, UserRole } from '../../../../commons/user/user.schema';
import { LeaveLegalEntityCommand } from '../../../model/user/leave-legal-entity.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { LastAdminCannotLeaveOrganization } from '../../error/last-admin-cannot-leave-organization';
import { validateLegalEntity } from '../../util/legal-entity.utils';

@CommandHandler(LeaveLegalEntityCommand)
export class LeaveLegalEntityCommandHandler implements ICommandHandler<LeaveLegalEntityCommand> {
    protected logger: Logger = new Logger(this.constructor.name);

    constructor(
        private readonly usersQryService: UserQueryService,
        private readonly usersService: UserService,
        private readonly legalEntityRepository: LegalEntityRepository,
        @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
    ) {}

    async execute(command: LeaveLegalEntityCommand): Promise<void> {
        await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);

        if ((await this.isUserAdmin(command.userId)) && (await this.isUserLastAdmin(command.legalEntityId))) {
            throw new LastAdminCannotLeaveOrganization();
        } else {
            await this.usersService.revokeUserPermissionForOrganization(command.userId, command.legalEntityId);
        }
    }

    private async isUserAdmin(userId: string): Promise<boolean> {
        const permissions = await this.usersQryService.retrieveUserPermissions(userId);
        const isAdmin = permissions.role === UserRole.ADMIN;
        this.logger.debug(`isUserAdmin: ${isAdmin}`);
        return isAdmin;
    }

    private async isUserLastAdmin(legalEntityId: string): Promise<boolean> {
        const admins = await this.userPermissionsModel.find({ legalEntityId: legalEntityId, role: UserRole.ADMIN });
        const lastAdmin = admins.length === 1;
        this.logger.debug(`lastAdmin: ${lastAdmin} | [${admins.length}] of admins in organization [${legalEntityId}]`);
        return lastAdmin;
    }
}
