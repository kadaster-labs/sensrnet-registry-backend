import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Checkpoint } from './checkpoint.interface';

@Injectable()
export class CheckpointService {

    constructor(@InjectModel('Checkpoint') private checkpointModel: Model<Checkpoint>) {}

    async findOne(conditions: Record<string, any>): Promise<Checkpoint | undefined> {
        return await this.checkpointModel.findOne(conditions).exec();
    }

    async updateOne(conditions: Record<string, any>, update: Record<string, any>): Promise<any> {
        const options = { upsert: true };
        return await this.checkpointModel.updateOne(conditions, update, options).exec();
    }
}
