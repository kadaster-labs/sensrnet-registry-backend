import { Model } from 'mongoose';
import { User } from './user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashField, hashableFields } from './user.model';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private userModel: Model<User>) {}

    async findOne(username: string): Promise<User | undefined> {
        return await this.userModel.findOne({_id: username}).exec();
    }

    async updateOne(username: string, updateFields: any) {
        const deleteFunction = (hashableField) => () => delete updateFields[hashableField];
        const updateFunction = (hashableField) => (hash) => updateFields[hashableField] = hash;
        const hashFunction = (hashableField) => (resolve, reject) => hashField(updateFields[hashableField], resolve, reject);

        for (const hashableField of hashableFields) {
            if (updateFields[hashableField]) {
                const promise = new Promise(hashFunction(hashableField));
                await promise.then(updateFunction(hashableField), deleteFunction(hashableField));
            }
        }

        return await this.userModel.updateOne({_id: username}, updateFields).exec();
    }
}
