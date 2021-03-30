import { Model } from 'mongoose';
import { IUser, IUserPermissions } from './model/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<IUser>,
        @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
    ) { }

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

    async getOrganizationId(_id: string): Promise<string> {
        const user: IUser = await this.userModel.findOne({ _id });
        return 'testOrg'; // TODO via relation? user.organizationId
    }
}
