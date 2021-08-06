import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermissions, UserPermissionsDocument, UserRole } from '../../commons/user/user-permissions.schema';
import { User, UserDocument } from '../../commons/user/user.schema';
import { UserAlreadyExistsException } from '../handler/error/user-already-exists-exception';
import { WrongLegalEntityException } from '../handler/error/wrong-legal-entity-exception';

@Injectable()
export class UserService {
    protected logger: Logger = new Logger(this.constructor.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(UserPermissions.name) private userPermissionsModel: Model<UserPermissionsDocument>,
    ) {}

    async saveUser(id: string, email: string, oidc: Record<string, any>): Promise<void> {
        try {
            this.logger.debug(`registering user [${email}]`);

            const userInstance = new this.userModel({
                _id: id,
                email: email,
                oidc: oidc,
                role: 'user',
            });

            await userInstance.save();
            this.logger.log(`saved user: [id: ${userInstance._id}]`);
        } catch (error) {
            this.logger.warn(error);
            throw new UserAlreadyExistsException(email);
        }
    }

    async grantAdminPermissionForOrganization(userId: string, legalEntityId: string): Promise<void> {
        this.logger.log(`grant [admin] permissions: [user: ${userId}] [organization: ${legalEntityId}]`);
        const userPermissions = { _id: userId, role: UserRole.ADMIN, legalEntityId: legalEntityId };
        await this.updateUserPermissions({ _id: userId }, userPermissions);
    }

    async revokeAdminPermissionForOrganization(userId: string, legalEntityId: string): Promise<void> {
        this.logger.log(`revoke [admin] permissions: [user: ${userId}] [organization: ${legalEntityId}]`);
        const userPermissions = { _id: userId, role: UserRole.USER, legalEntityId: legalEntityId };
        await this.updateUserPermissions({ _id: userId }, userPermissions);
    }

    async grantUserPermissionForOrganization(userId: string, legalEntityId: string): Promise<void> {
        this.logger.log(`grant [user] permissions: [user: ${userId}] [organization: ${legalEntityId}]`);
        const userPermissions = { _id: userId, role: UserRole.USER, legalEntityId: legalEntityId };
        await this.updateUserPermissions({ _id: userId }, userPermissions);
    }

    async revokeUserPermissionForOrganization(userId: string, legalEntityId: string): Promise<void> {
        this.logger.log(`revoke [user] permissions: [user: ${userId}] [organization: ${legalEntityId}]`);
        const user = (await this.userPermissionsModel.findOne({ _id: userId })) as UserPermissions;

        if (user.legalEntityId === legalEntityId) {
            const filter = { _id: userId };
            return this.userPermissionsModel.deleteOne(filter);
        } else {
            throw new WrongLegalEntityException();
        }
    }

    private async updateUserPermissions(
        filter: Record<string, any>,
        update: Record<string, any>,
    ): Promise<UserPermissions | undefined> {
        return this.userPermissionsModel.updateOne(filter, update, { new: true, upsert: true });
    }
}
