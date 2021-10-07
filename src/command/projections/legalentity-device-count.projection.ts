import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractProcessor } from '../../commons/event-processing/abstract.processor';
import { DeviceRegistered } from '../../commons/events/sensordevice/device/registered';
import { DeviceRemoved } from '../../commons/events/sensordevice/device/removed';
import { SensorDeviceEvent } from '../../commons/events/sensordevice/sensordevice.event';
import { ILegalEntityDeviceCount } from './models/legalentity-device-count.schema';

@Injectable()
export class LegalentityDeviceCountProjection extends AbstractProcessor {
    constructor(
        @InjectModel('LegalEntityDeviceCount') private legalEntityDeviceCountModel: Model<ILegalEntityDeviceCount>,
    ) {
        super();
    }

    async process(event: SensorDeviceEvent): Promise<void> {
        if (event instanceof DeviceRegistered) {
            const filter = { _id: event.legalEntityId };
            const update = { $inc: { count: 1 } };
            const options = { upsert: true };
            await this.legalEntityDeviceCountModel.findOneAndUpdate(filter, update, options);
        } else if (event instanceof DeviceRemoved) {
            const filter = { _id: event.legalEntityId };
            const update = { $inc: { count: -1 } };
            await this.legalEntityDeviceCountModel.findOneAndUpdate(filter, update);
        }
    }
}
