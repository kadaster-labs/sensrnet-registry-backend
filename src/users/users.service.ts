import { User } from './user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private userModel: Model<User>) {}

    async findOne(username: string): Promise<User | undefined> {
        return await this.userModel.findOne({username}).exec();
    }
}
