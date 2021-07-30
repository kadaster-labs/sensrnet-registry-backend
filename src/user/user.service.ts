import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WrongLegalEntityException } from './errors/wrong-legal-entity-exception';
import { IUser, IUserPermissions, UserRole } from './model/user.model';

@Injectable()
export class UserService {
    
    protected logger: Logger = new Logger(this.constructor.name);

    constructor(
        @InjectModel('User') private userModel: Model<IUser>,
        @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
    ) { }

    async retrieveUserPermissions(userId: string): Promise<IUserPermissions> {
        const permissions = await this.userPermissionsModel.findOne({ _id: userId }) as IUserPermissions;
        return permissions;
    }

    async grantAdminPermissionForOrganization(userId: string, legalEntityId: string) {
        this.logger.log(`grant [admin] permissions: [user: ${userId}] [organization: ${legalEntityId}]`);
        const userPermissions = { _id: userId, role: UserRole.ADMIN, legalEntityId: legalEntityId };
        await this.updateUserPermissions({ _id: userId }, userPermissions);
    }

    async revokeAdminPermissionForOrganization(userId: string, legalEntityId: string) {
        this.logger.log(`revoke [admin] permissions: [user: ${userId}] [organization: ${legalEntityId}]`);
        const userPermissions = { _id: userId, role: UserRole.USER, legalEntityId: legalEntityId };
        await this.updateUserPermissions({ _id: userId }, userPermissions);
    }

    async grantUserPermissionForOrganization(userId: string, legalEntityId: string) {
        this.logger.log(`grant [user] permissions: [user: ${userId}] [organization: ${legalEntityId}]`);
        const userPermissions = { _id: userId, role: UserRole.USER, legalEntityId: legalEntityId };
        await this.updateUserPermissions({ _id: userId }, userPermissions);
    }

    async revokeUserPermissionForOrganization(userId: string, legalEntityId: string) {
        this.logger.log(`revoke [user] permissions: [user: ${userId}] [organization: ${legalEntityId}]`);
        const user = await this.userPermissionsModel.findOne({ _id: userId }) as IUserPermissions;

        if (user.legalEntityId === legalEntityId) {
            const filter = { _id: userId };
            return this.userPermissionsModel.deleteOne(filter);
        }
        else {
            throw new WrongLegalEntityException();
        }
    }

    async findOne(...args: any[]): Promise<IUser | undefined> {
        return this.userModel.findOne(...args);
    }

    async find(...args: any[]): Promise<IUser[]> {
        return this.userModel.find(...args);
    }

    async findUserPermissions(...args: any[]): Promise<IUserPermissions | undefined> {
        return this.userPermissionsModel.findOne(...args);
    }

    async updateUserPermissions(filter: Record<string, any>, update: Record<string, any>): Promise<IUserPermissions | undefined> {
        return this.userPermissionsModel.updateOne(filter, update, { new: true, upsert: true });
    }

    async deleteUserPermissions(filter: Record<string, any>): Promise<IUserPermissions | undefined> {
        return this.userPermissionsModel.deleteOne(filter);
    }

    async updateOne(_id: string, updateFields: Record<string, any>): Promise<any> {
        return this.userModel.updateOne({ _id }, updateFields);
    }
}
