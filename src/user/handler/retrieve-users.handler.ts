import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RetrieveUserQuery } from '../query/users.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUser, IUserPermissions } from '../model/user.model';

@QueryHandler(RetrieveUserQuery)
export class RetrieveUserQueryHandler implements IQueryHandler<RetrieveUserQuery> {
  constructor(
      @InjectModel('User') private userModel: Model<IUser>,
      @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
  ) {}

  async execute(query: RetrieveUserQuery): Promise<Array<Record<string, any>>> {
    const userPermissions = await this.userPermissionsModel.find({legalEntityId: query.legalEntityId});

    const userIdToPermissions = {};
    for (const permissions of userPermissions) {
      userIdToPermissions[permissions._id] = permissions.toObject();
    }
    const mongoUsers = await this.userModel.find({_id: {$in: Object.keys(userIdToPermissions)}}, {email: 1});

    const users = [];
    for (const user of mongoUsers) {
      users.push({...user.toObject(), ...userIdToPermissions[user._id]});
    }

    return users;
  }
}
