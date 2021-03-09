import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDoc, User } from './user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDoc>,
    ) { }

    async findOne(_id: string): Promise<UserDoc | undefined> {
        return this.userModel.findOne({ _id });
    }

    async updateOne(_id: string, updateFields: Record<string, any>): Promise<any> {
        return this.userModel.updateOne({ _id }, updateFields);
    }

    async getOrganizationId(_id: string): Promise<string> {
        const user: UserDoc = await this.userModel.findOne({ _id });
        return user.organizationId;
    }
}
