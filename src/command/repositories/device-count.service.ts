import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDeviceCount } from '../model/legalentity-device-count.schema';

@Injectable()
export class DeviceCountService {
    protected logger: Logger = new Logger(this.constructor.name);

    constructor(@InjectModel('DeviceCount') private deviceCountModel: Model<IDeviceCount>) {}

    async incrementDeviceCount(legalEntityId: string, deviceId: string): Promise<void> {
        const update = { $push: { deviceIds: deviceId } };
        const options = { upsert: true };
        await this.updateDeviceCount(legalEntityId, update, options);
    }
    async reduceDeviceCount(legalEntityId: string, deviceId: string): Promise<void> {
        const update = { $pull: { deviceIds: deviceId } };
        await this.updateDeviceCount(legalEntityId, update);
    }

    async deleteLegalEntity(aggregateId: string) {
        const filter = { _id: aggregateId };
        await this.deviceCountModel.deleteOne(filter);
    }

    async hasDevices(legalEntityId: string): Promise<boolean> {
        const hasDevices = await this.deviceCountModel.findOne({ _id: legalEntityId }, { _id: -1, deviceIds: 1 });

        return hasDevices ? hasDevices.deviceIds.length > 0 : false;
    }

    private async updateDeviceCount(
        legalEntityId: string,
        update: Record<string, unknown>,
        options: Record<string, unknown> = {},
    ): Promise<IDeviceCount> {
        const filter = { _id: legalEntityId };
        return await this.deviceCountModel.findOneAndUpdate(filter, update, options);
    }
}
