import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractProcessor } from '../../commons/event-processing/abstract.processor';
import { Event } from '../../commons/event-store/event';
import { LegalEntityRemoved } from '../../commons/events/legal-entity/removed';
import { DeviceRegistered } from '../../commons/events/sensordevice/device/registered';
import { DeviceRemoved } from '../../commons/events/sensordevice/device/removed';
import { DeviceEsListener } from '../listeners/device.es.listener';
import { LegalEntityEsListener } from '../listeners/legal-entity.es.listener';
import { ILegalEntityDeviceCount } from './models/legalentity-device-count.schema';

@Injectable()
export class LegalEntityDeviceCountProjection extends AbstractProcessor {
    constructor(
        protected readonly deviceListener: DeviceEsListener,
        protected readonly legalEntityListener: LegalEntityEsListener,
        @InjectModel('LegalEntityDeviceCount') private legalEntityDeviceCountModel: Model<ILegalEntityDeviceCount>,
    ) {
        super([deviceListener, legalEntityListener]);
    }

    async process(event: Event, originSync: boolean): Promise<void> {
        if (!originSync) {
            if (event instanceof DeviceRegistered) {
                const filter = { _id: event.legalEntityId };
                const update = { $inc: { count: 1 } };
                const options = { upsert: true };
                await this.legalEntityDeviceCountModel.findOneAndUpdate(filter, update, options);
            } else if (event instanceof DeviceRemoved) {
                const filter = { _id: event.legalEntityId };
                const update = { $inc: { count: -1 } };
                await this.legalEntityDeviceCountModel.findOneAndUpdate(filter, update);
            } else if (event instanceof LegalEntityRemoved) {
                const filter = { _id: event.aggregateId };
                await this.legalEntityDeviceCountModel.deleteOne(filter);
            }
        }
    }
}
