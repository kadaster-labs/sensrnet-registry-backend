import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserPermissions } from './user.schema';

@Injectable()
export class UserQueryService {
    constructor(
        @InjectModel('User') private userModel: Model<IUser>,
        @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
    ) {}

    async retrieveUser(userId: string): Promise<IUser | undefined> {
        return this.userModel.findById(userId);
    }

    async retrieveUserPermissions(userId: string): Promise<IUserPermissions> {
        return this.userPermissionsModel.findById(userId);
    }
}
