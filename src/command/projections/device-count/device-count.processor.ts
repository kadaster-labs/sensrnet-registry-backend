import { Injectable } from '@nestjs/common';
import { AbstractProcessor } from '../../../commons/event-processing/abstract.processor';
import { Event } from '../../../commons/event-store/event';
import { LegalEntityRemoved } from '../../../commons/events/legal-entity/removed';
import { DeviceRegistered } from '../../../commons/events/sensordevice/device/registered';
import { DeviceRemoved } from '../../../commons/events/sensordevice/device/removed';
import { DeviceCountDeviceEsListener } from './device-count-device.listener';
import { DeviceCountLegalEntityEsListener } from './device-count-legal-entity.listener';
import { DeviceCountService } from './device-count.service';

@Injectable()
export class DeviceCountProcessor extends AbstractProcessor {
    constructor(
        protected readonly deviceListener: DeviceCountDeviceEsListener,
        protected readonly legalEntityListener: DeviceCountLegalEntityEsListener,
        protected readonly deviceCountService: DeviceCountService,
    ) {
        super([deviceListener, legalEntityListener]);
    }

    async process(event: Event, originSync: boolean): Promise<void> {
        if (originSync) {
            // skip processing
            return;
        }

        if (event instanceof DeviceRegistered) {
            await this.deviceCountService.incrementDeviceCount(event.legalEntityId);
        } else if (event instanceof DeviceRemoved) {
            await this.deviceCountService.reduceDeviceCount(event.legalEntityId);
        } else if (event instanceof LegalEntityRemoved) {
            await this.deviceCountService.deleteLegalEntity(event.aggregateId);
        }
    }
}
