import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserPermissions } from '../../commons/user/user.schema';
import { RetrieveUserQuery } from '../model/users.query';

@QueryHandler(RetrieveUserQuery)
export class RetrieveUserQueryHandler implements IQueryHandler<RetrieveUserQuery> {
    constructor(
        @InjectModel('User') private userModel: Model<IUser>,
        @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
    ) {}

    async execute(query: RetrieveUserQuery): Promise<Array<Record<string, any>>> {
        const userPermissions = await this.userPermissionsModel.find({ legalEntityId: query.legalEntityId });

        const userIdToPermissions = {};
        for (const permissions of userPermissions) {
            userIdToPermissions[permissions._id] = permissions.toObject();
        }
        const mongoUsers = await this.userModel.find({ _id: { $in: Object.keys(userIdToPermissions) } }, { email: 1 });

        const users = [];
        for (const user of mongoUsers) {
            users.push({ ...user.toObject(), ...userIdToPermissions[user._id] });
        }

        return users;
    }
}
