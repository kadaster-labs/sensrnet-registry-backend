import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { UserPermissions, UserPermissionsDocument } from './schema/user-permissions.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(UserPermissions.name) private userPermissionsModel: Model<UserPermissionsDocument>,
    ) { }

    async findOne(...args: any[]): Promise<User> {
        return this.userModel.findOne(...args);
    }

    async find(...args: any[]): Promise<User[]> {
        return this.userModel.find(...args);
    }

    async findUserPermissions(...args: any[]): Promise<UserPermissions> {
        return this.userPermissionsModel.findOne(...args);
    }

    async updateUserPermissions(filter: Record<string, any>, update: Record<string, any>): Promise<UserPermissions> {
        return this.userPermissionsModel.updateOne(filter, update, { new: true, upsert: true });
    }

    async deleteUserPermissions(filter: Record<string, any>): Promise<UserPermissions> {
        return this.userPermissionsModel.deleteOne(filter);
    }

    async updateOne(_id: string, updateFields: Record<string, any>): Promise<any> {
        return this.userModel.updateOne({ _id }, updateFields);
    }
}
