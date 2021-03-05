import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDoc, hashField, hashableFields, User } from './user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDoc>,
        ) {}

    async findOne(email: string): Promise<UserDoc | undefined> {
        return this.userModel.findOne({_id: email});
    }

    async findOidcUser(sub: string): Promise<UserDoc | undefined> {
        return this.userModel.findOne({ 'oidc.userinfo.sub': sub });
    }

    async updateOne(_id: string, updateFields: Record<string, any>): Promise<any> {
        const deleteFunction = (hashableField) => () => delete updateFields[hashableField];
        const updateFunction = (hashableField) => (hash) => updateFields[hashableField] = hash;
        const hashFunction = (hashableField) => (resolve, reject) => hashField(updateFields[hashableField], resolve, reject);

        for (const hashableField of hashableFields) {
            if (updateFields[hashableField]) {
                const promise = new Promise(hashFunction(hashableField));
                await promise.then(updateFunction(hashableField), deleteFunction(hashableField));
            }
        }

        return this.userModel.updateOne({ _id }, updateFields);
    }
}
