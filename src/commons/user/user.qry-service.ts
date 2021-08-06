import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermissions, UserPermissionsDocument } from './user-permissions.schema';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserQueryService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(UserPermissions.name) private userPermissionsModel: Model<UserPermissionsDocument>,
    ) {}

    async retrieveUser(userId: string): Promise<User | undefined> {
        return this.userModel.findOne({ _id: userId });
    }

    async retrieveUserPermissions(userId: string): Promise<UserPermissions> {
        return this.userPermissionsModel.findOne({ _id: userId });
    }
}
