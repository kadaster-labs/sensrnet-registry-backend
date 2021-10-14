import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDeviceCount } from './device-count.schema';

@Injectable()
export class DeviceCountService {
    constructor(@InjectModel('DeviceCount') private deviceCountModel: Model<IDeviceCount>) {}

    async incrementDeviceCount(legalEntityId: string): Promise<void> {
        const update = { $inc: { count: 1 } };
        const options = { upsert: true };
        await this.updateDeviceCount(legalEntityId, update, options);
    }
    async reduceDeviceCount(legalEntityId: string): Promise<void> {
        const update = { $inc: { count: -1 } };
        await this.updateDeviceCount(legalEntityId, update);
    }

    async deleteLegalEntity(aggregateId: string) {
        const filter = { _id: aggregateId };
        await this.deviceCountModel.deleteOne(filter);
    }

    async hasDevices(legalEntityId: string): Promise<boolean> {
        const hasDevices = await this.deviceCountModel.findOne({ _id: legalEntityId }, { _id: -1, count: 1 });

        return hasDevices ? hasDevices.count > 0 : false;
    }

    protected logger: Logger = new Logger(this.constructor.name);

    private async updateDeviceCount(
        legalEntityId: string,
        update: Record<string, unknown>,
        options: Record<string, unknown> = {},
    ): Promise<IDeviceCount> {
        const filter = { _id: legalEntityId };
        return await this.deviceCountModel.findOneAndUpdate(filter, update, options);
    }
}
