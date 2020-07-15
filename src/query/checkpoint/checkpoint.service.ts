import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Checkpoint } from './checkpoint.interface';

@Injectable()
export class CheckpointService {

    constructor(@InjectModel('Checkpoint') private checkpointModel: Model<Checkpoint>) {}

    async findOne(conditions: any): Promise<Checkpoint | undefined> {
        return await this.checkpointModel.findOne(conditions).exec();
    }

    async updateOne(conditions: any, update: any) {
        const options = { upsert: true };
        return await this.checkpointModel.updateOne(conditions, update, options).exec();
    }
}
