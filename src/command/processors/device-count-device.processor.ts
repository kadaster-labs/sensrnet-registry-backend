import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { DeviceProcessor } from '../../commons/event-processing/device.processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { LegalEntityRemoved } from '../../commons/events/legal-entity';
import { DeviceRegistered, DeviceRemoved, sensorDeviceStreamRootValue } from '../../commons/events/sensordevice';
import { SensorDeviceEvent } from '../../commons/events/sensordevice/sensordevice.event';
import { DeviceCountEsListener } from './device-count.es.listener';

@Injectable()
export class DeviceCountDeviceProcessor extends DeviceProcessor {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        private readonly listener: DeviceCountEsListener,
    ) {
        super(`device-count-${sensorDeviceStreamRootValue}-es`, eventStore, checkpointService);
    }

    async process(event: SensorDeviceEvent, originSync: boolean): Promise<void> {
        if (!originSync) {
            if (event instanceof DeviceRegistered) {
                await this.listener.processDeviceRegistered(event);
            } else if (event instanceof DeviceRemoved) {
                await this.listener.processDeviceRemoved(event);
            } else if (event instanceof LegalEntityRemoved) {
                await this.listener.processLegalEntityRemoved(event);
            }
        }
    }
}
