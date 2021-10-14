import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
import { Event } from '../../commons/event-store/event';
import { LegalEntityRemoved } from '../../commons/events/legal-entity/removed';
import { DeviceRegistered } from '../../commons/events/sensordevice/device/registered';
import { DeviceRemoved } from '../../commons/events/sensordevice/device/removed';
import { ILegalEntityDeviceCount } from '../model/legalentity-device-count.schema';
import { DeviceCountDeviceProcessor } from './device-count-device.processor';
import { DeviceCountLegalEntityProcessor } from './device-count-legal-entity.processor';

@Injectable()
export class DeviceCountLegalEntityEsListener extends AbstractEsListener {
    constructor(
        protected readonly deviceProcessor: DeviceCountDeviceProcessor,
        protected readonly legalEntityProcessor: DeviceCountLegalEntityProcessor,
        @InjectModel('LegalEntityDeviceCount') private legalEntityDeviceCountModel: Model<ILegalEntityDeviceCount>,
    ) {
        super([deviceProcessor, legalEntityProcessor]);
    }

    async process(event: Event, originSync: boolean): Promise<void> {
        if (!originSync) {
            if (event instanceof DeviceRegistered) {
                const filter = { _id: event.legalEntityId };
                const update = { $push: { deviceIds: event.deviceId } };
                const options = { upsert: true };
                await this.legalEntityDeviceCountModel.findOneAndUpdate(filter, update, options);
            } else if (event instanceof DeviceRemoved) {
                const filter = { _id: event.legalEntityId };
                const update = { $pull: { deviceIds: event.deviceId } };
                await this.legalEntityDeviceCountModel.findOneAndUpdate(filter, update);
            } else if (event instanceof LegalEntityRemoved) {
                const filter = { _id: event.aggregateId };
                await this.legalEntityDeviceCountModel.deleteOne(filter);
            }
        }
    }
}
