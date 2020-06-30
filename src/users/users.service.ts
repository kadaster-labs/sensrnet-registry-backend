import { Model } from 'mongoose';
import { User } from './user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashField, hashAbleFields } from './models/user.model';

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private userModel: Model<User>) {}

    async findOne(username: string): Promise<User | undefined> {
        return await this.userModel.findOne({_id: username}).exec();
    }

    async updateOne(username: string, updateFields: any) {
        for (const hashAbleField of hashAbleFields) {
            if (updateFields[hashAbleField]) {
                const promise = new Promise((resolve, reject) => {
                    hashField(updateFields[hashAbleField], resolve, reject);
                });
                await promise.then((hash) => {
                    updateFields[hashAbleField] = hash;
                }, () => delete updateFields[hashAbleField]);
            }
        }

        return await this.userModel.updateOne({_id: username}, updateFields).exec();
    }
}
