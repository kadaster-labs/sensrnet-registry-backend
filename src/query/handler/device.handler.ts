import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RetrieveDeviceQuery } from '../model/device.query';
import { IDevice } from '../model/device.schema';

@QueryHandler(RetrieveDeviceQuery)
export class RetrieveDeviceQueryHandler implements IQueryHandler<RetrieveDeviceQuery> {
    constructor(@InjectModel('Device') private model: Model<IDevice>) {}

    async execute(query: RetrieveDeviceQuery): Promise<any> {
        return this.model.findOne({ _id: query.id });
    }
}
