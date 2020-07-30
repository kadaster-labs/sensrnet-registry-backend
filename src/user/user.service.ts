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
        for (const hashableField of hashableFields) {
            if (updateFields[hashableField]) {
                const promise = new Promise((resolve, reject) => {
                    hashField(updateFields[hashableField], resolve, reject);
                });
                await promise.then((hash) => {
                    updateFields[hashableField] = hash;
                }, () => delete updateFields[hashableField]);
            }
        }

        return await this.userModel.updateOne({_id: username}, updateFields).exec();
    }
}
