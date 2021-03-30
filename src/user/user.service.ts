import { Model } from 'mongoose';
import { IUser, IUserPermissions } from './model/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashField, hashableFields } from './model/user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<IUser>,
        @InjectModel('UserPermissions') private userPermissionsModel: Model<IUserPermissions>,
        ) {}

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
        return this.userPermissionsModel.updateOne(filter, update, {new: true, upsert: true});
    }

    async deleteUserPermissions(filter: Record<string, any>): Promise<IUserPermissions | undefined> {
        return this.userPermissionsModel.deleteOne(filter);
    }

    async updateOne(id: string, updateFields: Record<string, any>): Promise<any> {
        const deleteFunction = (hashableField) => () => delete updateFields[hashableField];
        const updateFunction = (hashableField) => (hash) => updateFields[hashableField] = hash;
        const hashFunction = (hashableField) => (resolve, reject) => hashField(updateFields[hashableField], resolve, reject);

        for (const hashableField of hashableFields) {
            if (updateFields[hashableField]) {
                const promise = new Promise(hashFunction(hashableField));
                await promise.then(updateFunction(hashableField), deleteFunction(hashableField));
            }
        }

        return this.userModel.updateOne({_id: id}, updateFields);
    }
}
