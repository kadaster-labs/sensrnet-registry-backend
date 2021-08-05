import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserPermissions } from './user.schema';

@Injectable()
export class UserQueryService {

    constructor(
        @InjectModel('User') private userModel: Model<IUser>,
        @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
    ) { }

    async retrieveUser(userId: string): Promise<IUser | undefined> {
        const user = await this.userModel.findOne({ _id: userId });
        return user;
    }

    async retrieveUserPermissions(userId: string): Promise<IUserPermissions> {
        const permissions = await this.userPermissionsModel.findOne({ _id: userId }) as IUserPermissions;
        return permissions;
    }

}
