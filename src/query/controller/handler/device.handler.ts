import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IDevice } from '../../model/device.model';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveDeviceQuery } from '../query/device.query';

@QueryHandler(RetrieveDeviceQuery)
export class RetrieveDeviceQueryHandler implements IQueryHandler<RetrieveDeviceQuery> {
    constructor(
        @InjectModel('Device') private model: Model<IDevice>,
    ) {}

    async execute(query: RetrieveDeviceQuery): Promise<any> {
        return this.model.findOne({ _id: query.id });
    }
}
