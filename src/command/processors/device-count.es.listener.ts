import { Injectable } from '@nestjs/common';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
import { LegalEntityRemoved } from '../../commons/events/legal-entity/removed';
import { DeviceRegistered } from '../../commons/events/sensordevice/device/registered';
import { DeviceRemoved } from '../../commons/events/sensordevice/device/removed';
import { DeviceCountService } from '../repositories/device-count.service';

@Injectable()
export class DeviceCountEsListener extends AbstractEsListener {
    constructor(protected readonly deviceCountService: DeviceCountService) {
        super();
    }

    async processDeviceRegistered(event: DeviceRegistered): Promise<void> {
        await this.deviceCountService.incrementDeviceCount(event.legalEntityId, event.deviceId);
    }

    async processDeviceRemoved(event: DeviceRemoved): Promise<void> {
        await this.deviceCountService.reduceDeviceCount(event.legalEntityId, event.deviceId);
    }

    async processLegalEntityRemoved(event: LegalEntityRemoved): Promise<void> {
        await this.deviceCountService.deleteLegalEntity(event.aggregateId);
    }
}
